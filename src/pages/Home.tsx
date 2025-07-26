import { Link } from 'react-router-dom';

import {
  Activity,
  Award,
  Calendar,
  ChevronRight,
  MapPin,
  Play,
  Plus,
  Route,
  Target,
  Timer,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  // Mock data - nanti akan diganti dengan data dari InstantDB
  const mockStats = {
    totalRuns: 15,
    totalDistance: 127.5, // km
    totalTime: 18.5, // hours
    avgPace: 6.9, // km/h
    longestRun: 12.3, // km
    thisWeekRuns: 3,
    thisWeekDistance: 18.7, // km
    currentStreak: 5, // days
  };

  const mockRecentRuns = [
    {
      id: 1,
      date: '2025-07-25',
      distance: 8.2,
      duration: '45:32',
      pace: 6.8,
      route: 'Morning Park Loop',
    },
    {
      id: 2,
      date: '2025-07-23',
      distance: 5.5,
      duration: '32:15',
      pace: 7.2,
      route: 'Riverside Trail',
    },
    {
      id: 3,
      date: '2025-07-21',
      distance: 10.1,
      duration: '58:45',
      pace: 6.5,
      route: 'City Circuit',
    },
  ];

  const achievements = [
    { icon: '🏃', title: 'First 5K', description: 'Completed your first 5km run!' },
    { icon: '⚡', title: 'Speed Demon', description: 'Achieved 8+ km/h pace' },
    { icon: '🔥', title: '5-Day Streak', description: 'Ran for 5 consecutive days' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Run Tracker
              </h1>
              <p className="text-gray-600 mt-1">Track your running journey</p>
            </div>

            <Link
              to="/tracking"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start Run</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalRuns}</p>
                <p className="text-sm text-gray-600">Total Runs</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Route className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalDistance}</p>
                <p className="text-sm text-gray-600">Total km</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Timer className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalTime}h</p>
                <p className="text-sm text-gray-600">Total Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.avgPace}</p>
                <p className="text-sm text-gray-600">Avg km/h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Action Card */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Ready for your next run?</h2>
                <p className="text-blue-100 mb-6">
                  Track your route, monitor your pace, and achieve your goals.
                </p>

                <Link
                  to="/tracking"
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Start New Run</span>
                </Link>
              </div>

              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 translate-x-12"></div>
            </div>

            {/* Recent Runs */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Runs</h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {mockRecentRuns.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{run.route}</p>
                        <p className="text-sm text-gray-600">{run.date}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">{run.distance} km</p>
                      <p className="text-sm text-gray-600">{run.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* This Week Stats */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>This Week</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Runs</span>
                  <span className="font-bold text-gray-900">{mockStats.thisWeekRuns}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-bold text-gray-900">{mockStats.thisWeekDistance} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Streak</span>
                  <span className="font-bold text-orange-600 flex items-center space-x-1">
                    <span>{mockStats.currentStreak} days</span>
                    <span>🔥</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Goals/Targets */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <span>Goals</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Weekly Goal</span>
                    <span className="font-medium">{mockStats.thisWeekDistance}/25 km</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                      style={{ width: `${(mockStats.thisWeekDistance / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Monthly Runs</span>
                    <span className="font-medium">{mockStats.totalRuns}/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full"
                      style={{ width: `${(mockStats.totalRuns / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span>Recent Achievements</span>
              </h3>

              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{achievement.title}</p>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
