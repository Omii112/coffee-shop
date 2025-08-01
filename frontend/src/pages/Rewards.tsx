import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Coffee, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Rewards = () => {
  const { user, isAuthenticated } = useAuth();

  const rewardTiers = [
    { name: 'Bronze', points: 0, color: 'bg-amber-600', benefits: ['5% discount on pastries'] },
    { name: 'Silver', points: 100, color: 'bg-gray-400', benefits: ['10% discount on all items', 'Free birthday drink'] },
    { name: 'Gold', points: 250, color: 'bg-yellow-500', benefits: ['15% discount on all items', 'Free birthday drink', 'Priority ordering'] },
    { name: 'Platinum', points: 500, color: 'bg-purple-600', benefits: ['20% discount on all items', 'Free birthday drink', 'Priority ordering', 'Exclusive menu items'] }
  ];

  const getCurrentTier = () => {
    if (!user) return rewardTiers[0];
    const userPoints = user.rewardPoints;
    return rewardTiers.reverse().find(tier => userPoints >= tier.points) || rewardTiers[0];
  };

  const getNextTier = () => {
    if (!user) return rewardTiers[1];
    const userPoints = user.rewardPoints;
    return rewardTiers.find(tier => userPoints < tier.points);
  };

  const getProgressToNextTier = () => {
    if (!user) return 0;
    const currentTier = getCurrentTier();
    const nextTier = getNextTier();
    if (!nextTier) return 100;
    
    const progress = ((user.rewardPoints - currentTier.points) / (nextTier.points - currentTier.points)) * 100;
    return Math.min(progress, 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Gift className="h-16 w-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Join Our Rewards Program</h1>
          <p className="text-xl text-gray-600 mb-8">Sign up to start earning points and unlock exclusive benefits!</p>
        </div>
      </div>
    );
  }

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Rewards Program</h1>
          <p className="text-xl text-gray-600">Earn points with every purchase and unlock amazing benefits</p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-6 w-6 text-amber-600" />
                Your Rewards Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-900 mb-2">{user?.rewardPoints}</div>
                  <div className="text-gray-600">Total Points</div>
                </div>
                
                <div className="text-center">
                  <Badge className={`${currentTier.color} text-white mb-2`}>
                    {currentTier.name} Member
                  </Badge>
                  <div className="text-gray-600">Current Tier</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Member since {user?.memberSince.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {nextTier && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress to {nextTier.name}</span>
                    <span className="text-sm text-gray-600">
                      {nextTier.points - (user?.rewardPoints || 0)} points to go
                    </span>
                  </div>
                  <Progress value={getProgressToNextTier()} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Reward Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Reward Tiers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewardTiers.map((tier, index) => (
              <Card key={tier.name} className={`${currentTier.name === tier.name ? 'ring-2 ring-amber-500' : ''}`}>
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 ${tier.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <p className="text-sm text-gray-600">{tier.points}+ points</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <Coffee className="h-3 w-3 text-amber-600 mt-1 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* How to Earn Points */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-amber-600" />
                How to Earn Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coffee className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Make Purchases</h3>
                  <p className="text-sm text-gray-600">Earn 1 point for every $1 spent</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Leave Reviews</h3>
                  <p className="text-sm text-gray-600">Get 10 bonus points for each review</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Refer Friends</h3>
                  <p className="text-sm text-gray-600">Earn 50 points for each friend who joins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Rewards;