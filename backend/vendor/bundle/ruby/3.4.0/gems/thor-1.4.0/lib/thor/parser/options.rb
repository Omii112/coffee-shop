class Thor
  class Options < Arguments #:nodoc:
    LONG_RE     = /^(--\w+(?:-\w+)*)$/
    SHORT_RE    = /^(-[a-z])$/i
    EQ_RE       = /^(--\w+(?:-\w+)*|-[a-z])=(.*)$/i
    SHORT_SQ_RE = /^-([a-z]{2,})$/i # Allow either -x -v or -xv style for single char args
    SHORT_NUM   = /^(-[a-z])#{NUMERIC}$/i
    OPTS_END    = "--".freeze

    # Receives a hash and makes it switches.
    def self.to_switches(options)
      options.map do |key, value|
        case value
        when true
          "--#{key}"
        when Array
          "--#{key} #{value.map(&:inspect).join(' ')}"
        when Hash
          "--#{key} #{value.map { |k, v| "#{k}:#{v}" }.join(' ')}"
        when nil, false
          nil
        else
          "--#{key} #{value.inspect}"
        end
      end.compact.join(" ")
    end

    # Takes a hash of Thor::Option and a hash with defaults.
    #
    # If +stop_on_unknown+ is true, #parse will stop as soon as it encounters
    # an unknown option or a regular argument.
    def initialize(hash_options = {}, defaults = {}, stop_on_unknown = false, disable_required_check = false, relations = {})
      @stop_on_unknown = stop_on_unknown
      @exclusives = (relations[:exclusive_option_names] || []).select{|array| !array.empty?}
      @at_least_ones = (relations[:at_least_one_option_names] || []).select{|array| !array.empty?}
      @disable_required_check = disable_required_check
      options = hash_options.values
      super(options)

      # Add defaults
      defaults.each do |key, value|
        @assigns[key.to_s] = value
        @non_assigned_required.delete(hash_options[key])
      end

      @shorts = {}
      @switches = {}
      @extra = []
      @stopped_parsing_after_extra_index = nil
      @is_treated_as_value = false

      options.each do |option|
        @switches[option.switch_name] = option

        option.aliases.each do |name|
          @shorts[name] ||= option.switch_name
        end
      end
    end

    def remaining
      @extra
    end

    def peek
      return super unless @parsing_options

      result = super
      if result == OPTS_END
        shift
        @parsing_options = false
        @stopped_parsing_after_extra_index ||= @extra.size
        super
      else
        result
      end
    end

    def shift
      @is_treated_as_value = false
      super
    end

    def unshift(arg, is_value: false)
      @is_treated_as_value = is_value
      super(arg)
    end

    def parse(args) # rubocop:disable Metrics/MethodLength
      @pile = args.dup
      @is_treated_as_value = false
      @parsing_options = true

      while peek
        if parsing_options?
          match, is_switch = current_is_switch?
          shifted = shift

          if is_switch
            case shifted
            when SHORT_SQ_RE
              unshift($1.split("").map { |f| "-#{f}" })
              next
            when EQ_RE
              unshift($2, is_value: true)
              switch = $1
            when SHORT_NUM
              unshift($2)
              switch = $1
            when LONG_RE, SHORT_RE
              switch = $1
            end

            switch = normalize_switch(switch)
            option = switch_option(switch)
            result = parse_peek(switch, option)
            assign_result!(option, result)
          elsif @stop_on_unknown
            @parsing_options = false
            @extra << shifted
            @stopped_parsing_after_extra_index ||= @extra.size
            @extra << shift while peek
            break
          elsif match
            @extra << shifted
            @extra << shift while peek && peek !~ /^-/
          else
            @extra << shifted
          end
        else
          @extra << shift
        end
      end

      check_requirement! unless @disable_required_check
      check_exclusive!
      check_at_least_one!

      assigns = Thor::CoreExt::HashWithIndifferentAccess.new(@assigns)
      assigns.freeze
      assigns
    end

    def check_exclusive!
      opts = @assigns.keys
      # When option A and B are exclusive, if A and B are given at the same time,
      # the difference of argument array size will decrease.
      found = @exclusives.find{ |ex| (ex - opts).size < ex.size - 1 }
      if found
        names = names_to_switch_names(found & opts).map{|n| "'#{n}'"}
        class_name = self.class.name.split("::").last.downcase
        fail ExclusiveArgumentError, "Found exclusive #{class_name} #{names.join(", ")}"
      end
    end

    def check_at_least_one!
      opts = @assigns.keys
      # When at least one is required of the options A and B,
      # if the both options were not given, none? would be true.
      found = @at_least_ones.find{ |one_reqs| one_reqs.none?{ |o| opts.include? o} }
      if found
        names = names_to_switch_names(found).map{|n| "'#{n}'"}
        class_name = self.class.name.split("::").last.downcase
        fail AtLeastOneRequiredArgumentError, "Not found at least one of required #{class_name} #{names.join(", ")}"
      end
    end

    def check_unknown!
      to_check = @stopped_parsing_after_extra_index ? @extra[0...@stopped_parsing_after_extra_index] : @extra

      # an unknown option starts with - or -- and has no more --'s afterward.
      unknown = to_check.select { |str| str =~ /^--?(?:(?!--).)*$/ }
      raise UnknownArgumentError.new(@switches.keys, unknown) unless unknown.empty?
    end

  protected

    # Option names changes to swith name or human name
    def names_to_switch_names(names = [])
      @switches.map do |_, o|
        if names.include? o.name
          o.respond_to?(:switch_name) ? o.switch_name : o.human_name
        else
          nil
        end
      end.compact
    end

    def assign_result!(option, result)
      if option.repeatable && option.type == :hash
        (@assigns[option.human_name] ||= {}).merge!(result)
      elsif option.repeatable
        (@assigns[option.human_name] ||= []) << result
      else
        @assigns[option.human_name] = result
      end
    end

    # Check if the current value in peek is a registered switch.
    #
    # Two booleans are returned.  The first is true if the current value
    # starts with a hyphen; the second is true if it is a registered switch.
    def current_is_switch?
      return [false, false] if @is_treated_as_value
      case peek
      when LONG_RE, SHORT_RE, EQ_RE, SHORT_NUM
        [true, switch?($1)]
      when SHORT_SQ_RE
        [true, $1.split("").any? { |f| switch?("-#{f}") }]
      else
        [false, false]
      end
    end

    def current_is_switch_formatted?
      return false if @is_treated_as_value
      case peek
      when LONG_RE, SHORT_RE, EQ_RE, SHORT_NUM, SHORT_SQ_RE
        true
      else
        false
      end
    end

    def current_is_value?
      return true if @is_treated_as_value
      peek && (!parsing_options? || super)
    end

    def switch?(arg)
      !switch_option(normalize_switch(arg)).nil?
    end

    def switch_option(arg)
      if match = no_or_skip?(arg) # rubocop:disable Lint/AssignmentInCondition
        @switches[arg] || @switches["--#{match}"]
      else
        @switches[arg]
      end
    end

    # Check if the given argument is actually a shortcut.
    #
    def normalize_switch(arg)
      (@shorts[arg] || arg).tr("_", "-")
    end

    def parsing_options?
      peek
      @parsing_options
    end

    # Parse boolean values which can be given as --foo=true or --foo for true values, or
    # --foo=false, --no-foo or --skip-foo for false values.
    #
    def parse_boolean(switch)
      if current_is_value?
        if ["true", "TRUE", "t", "T", true].include?(peek)
          shift
          true
        elsif ["false", "FALSE", "f", "F", false].include?(peek)
          shift
          false
        else
          @switches.key?(switch) || !no_or_skip?(switch)
        end
      else
        @switches.key?(switch) || !no_or_skip?(switch)
      end
    end

    # Parse the value at the peek analyzing if it requires an input or not.
    #
    def parse_peek(switch, option)
      if parsing_options? && (current_is_switch_formatted? || last?)
        if option.boolean?
          # No problem for boolean types
        elsif no_or_skip?(switch)
          return nil # User set value to nil
        elsif option.string? && !option.required?
          # Return the default if there is one, else the human name
          return option.lazy_default || option.default || option.human_name
        elsif option.lazy_default
          return option.lazy_default
        else
          raise MalformattedArgumentError, "No value provided for option '#{switch}'"
        end
      end

      @non_assigned_required.delete(option)
      send(:"parse_#{option.type}", switch)
    end
  end
end
