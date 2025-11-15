import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { RankBadge } from '../components/RankBadge';
import { TrendingUp, Crown, Award } from 'lucide-react';
import { calculateRank } from '../utils/points';
import { RANKS } from '../utils/points';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import * as api from '../utils/api';
import { useTranslation } from '../utils/i18n';

export function IcebergPage() {
  const { user, activeUserId } = useAuth();
  const { t } = useTranslation();
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 0.016); 
    }, 16);
    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    loadPortfolioData();
  }, [activeUserId]);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const data = await api.getPortfolio();
      setTotalPoints(data.totalPoints || user?.tethysPoints || 0);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      // Fallback to user points
      setTotalPoints(user?.tethysPoints || 0);
    } finally {
      setLoading(false);
    }
  };

  const maxPoints = 3000;
  const percentage = Math.min((totalPoints / maxPoints) * 100, 100);
  const { current, next, progress } = calculateRank(totalPoints);

 
  const verticalBob = Math.sin(time * 0.9) * 5;
  const horizontalBob = Math.sin(time * 0.7 + 1.5) * 2.5; 
  const lightShift = Math.sin(time * 1.2) * 0.15; 
  const wavePhase = time * 1.8; 

  
  const visiblePercentage = 15 + (percentage * 0.35);
  
 
  const waterLineY = 450;
  

  const icebergTotalHeight = 600;
  const icebergTop = waterLineY - (visiblePercentage / 100) * icebergTotalHeight;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 text-cyan-100 drop-shadow-lg">
            Айсберг достижений
          </h1>
          <p className="text-xl text-cyan-200/70">
            Чем больше очков, тем выше твой айсберг поднимается из океана
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         
          <div className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-2 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-100">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Статистика
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-200/70">TethysPoints</span>
                    <span className="text-3xl bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                      {totalPoints}
                    </span>
                  </div>
                  <div className="text-sm text-cyan-300/60">
                    До максимума: {maxPoints - totalPoints} TP
                  </div>
                </div>

                <div className="pt-4 border-t border-cyan-500/20">
                  <RankBadge points={totalPoints} showProgress />
                </div>

                <div className="pt-4 border-t border-cyan-500/20">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-200/70">Над водой</span>
                      <span className="text-cyan-100">{visiblePercentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border-2 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-100">Легенда</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-sky-200 to-cyan-300 border border-cyan-400 rounded"></div>
                  <span className="text-sm text-cyan-200/70">Надводная часть</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-700 to-blue-900 border border-blue-600 rounded"></div>
                  <span className="text-sm text-cyan-200/70">Подводная часть</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-cyan-400 border-t-2 border-cyan-300 rounded"></div>
                  <span className="text-sm text-cyan-200/70">Уровень воды</span>
                </div>
              </CardContent>
            </Card>
          </div>

          
          <div className="xl:col-span-2">
            <Card className="bg-slate-800/50 backdrop-blur-md border-2 border-cyan-500/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-[900px] overflow-hidden">
                  <svg
                    viewBox="0 0 800 900"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                    
                      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#7dd3fc" />
                        <stop offset="45%" stopColor="#38bdf8" />
                        <stop offset="55%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#1e3a8a" />
                      </linearGradient>

                    
                      <linearGradient id="iceLight1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f0f9ff" />
                        <stop offset="100%" stopColor="#bae6fd" />
                      </linearGradient>
                      <linearGradient id="iceLight2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e0f2fe" />
                        <stop offset="100%" stopColor="#7dd3fc" />
                      </linearGradient>
                      <linearGradient id="iceLight3" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#dbeafe" />
                        <stop offset="100%" stopColor="#93c5fd" />
                      </linearGradient>

                    
                      <linearGradient id="iceDark1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#002940" />
                        <stop offset="100%" stopColor="#001824" />
                      </linearGradient>
                      <linearGradient id="iceDark2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#003d5c" />
                        <stop offset="100%" stopColor="#002940" />
                      </linearGradient>
                      <linearGradient id="iceDark3" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#002f45" />
                        <stop offset="100%" stopColor="#001f30" />
                      </linearGradient>

                    
                      <clipPath id="aboveWaterClip">
                        <rect x="0" y="0" width="800" height={waterLineY} />
                      </clipPath>
                      <clipPath id="belowWaterClip">
                        <rect x="0" y={waterLineY} width="800" height="450" />
                      </clipPath>
                    </defs>

                 
                    <rect x="0" y="0" width="800" height="900" fill="url(#bgGradient)" />

            
                    <g opacity="0.15">
                      {[0, 1, 2].map((i) => {
                        const y = waterLineY - 10 + i * 7;
                        return (
                          <ellipse
                            key={`distort-${i}`}
                            cx={400 + Math.sin(wavePhase + i) * 30}
                            cy={y}
                            rx={150 + Math.sin(wavePhase * 1.3 + i * 0.7) * 20}
                            ry={8}
                            fill="#ffffff"
                            opacity={0.3 - i * 0.1}
                          />
                        );
                      })}
                    </g>

                   
                    <g
                      transform={`translate(${horizontalBob}, ${verticalBob})`}
                      style={{ transition: 'opacity 0.3s' }}
                      className="group-hover:opacity-90"
                    >
                    
                      <g clipPath="url(#belowWaterClip)" opacity="0.95">
                       
                        <polygon
                          points={`400,${icebergTop + 300} 250,${icebergTop + 450} 400,${icebergTop + 600}`}
                          fill="url(#iceDark1)"
                          stroke="#001216"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`400,${icebergTop + 300} 550,${icebergTop + 450} 400,${icebergTop + 600}`}
                          fill="url(#iceDark2)"
                          stroke="#001824"
                          strokeWidth="1.5"
                        />

                       
                        <polygon
                          points={`280,${icebergTop + 200} 200,${icebergTop + 350} 250,${icebergTop + 450}`}
                          fill="#002940"
                          stroke="#001f30"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`280,${icebergTop + 200} 250,${icebergTop + 450} 400,${icebergTop + 300}`}
                          fill="#003d5c"
                          stroke="#002940"
                          strokeWidth="1.5"
                          opacity={0.9 + lightShift * 0.3}
                        />

                       
                        <polygon
                          points={`520,${icebergTop + 200} 600,${icebergTop + 350} 550,${icebergTop + 450}`}
                          fill="#002f45"
                          stroke="#002133"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`520,${icebergTop + 200} 550,${icebergTop + 450} 400,${icebergTop + 300}`}
                          fill="url(#iceDark3)"
                          stroke="#001f30"
                          strokeWidth="1.5"
                          opacity={0.85 + lightShift * 0.2}
                        />

                        
                        <polygon
                          points={`200,${icebergTop + 350} 250,${icebergTop + 450} 400,${icebergTop + 600}`}
                          fill="#001f30"
                          stroke="#001216"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`600,${icebergTop + 350} 550,${icebergTop + 450} 400,${icebergTop + 600}`}
                          fill="#002940"
                          stroke="#001824"
                          strokeWidth="1.5"
                        />

                     
                        <polygon
                          points={`280,${icebergTop + 200} 200,${icebergTop + 350} 230,${icebergTop + 250}`}
                          fill="#002f45"
                          stroke="#002133"
                          strokeWidth="1"
                        />
                        <polygon
                          points={`520,${icebergTop + 200} 600,${icebergTop + 350} 570,${icebergTop + 250}`}
                          fill="#003d5c"
                          stroke="#002940"
                          strokeWidth="1"
                        />
                      </g>

                      
                      <g clipPath="url(#aboveWaterClip)">
                       
                        <polygon
                          points={`400,${icebergTop} 380,${icebergTop + 80} 400,${icebergTop + 120}`}
                          fill="#ffffff"
                          stroke="#e0f2fe"
                          strokeWidth="1.5"
                          opacity={0.95 + lightShift * 0.2}
                        />
                        <polygon
                          points={`400,${icebergTop} 420,${icebergTop + 80} 400,${icebergTop + 120}`}
                          fill="#f0f9ff"
                          stroke="#dbeafe"
                          strokeWidth="1.5"
                          opacity={0.9 + lightShift * 0.15}
                        />

                       
                        <polygon
                          points={`400,${icebergTop} 340,${icebergTop + 60} 380,${icebergTop + 80}`}
                          fill="url(#iceLight2)"
                          stroke="#7dd3fc"
                          strokeWidth="1.5"
                          opacity={0.95}
                        />
                        <polygon
                          points={`340,${icebergTop + 60} 300,${icebergTop + 120} 380,${icebergTop + 80}`}
                          fill="#bae6fd"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                          opacity={0.9 + lightShift * 0.25}
                        />

                      
                        <polygon
                          points={`400,${icebergTop} 460,${icebergTop + 60} 420,${icebergTop + 80}`}
                          fill="url(#iceLight1)"
                          stroke="#bae6fd"
                          strokeWidth="1.5"
                          opacity={0.98}
                        />
                        <polygon
                          points={`460,${icebergTop + 60} 500,${icebergTop + 120} 420,${icebergTop + 80}`}
                          fill="url(#iceLight3)"
                          stroke="#7dd3fc"
                          strokeWidth="1.5"
                          opacity={0.95 + lightShift * 0.3}
                        />

                      
                        <polygon
                          points={`300,${icebergTop + 120} 260,${icebergTop + 200} 320,${icebergTop + 180}`}
                          fill="#7dd3fc"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`300,${icebergTop + 120} 320,${icebergTop + 180} 380,${icebergTop + 80}`}
                          fill="#93c5fd"
                          stroke="#60a5fa"
                          strokeWidth="1.5"
                          opacity={0.85 + lightShift * 0.2}
                        />
                        <polygon
                          points={`300,${icebergTop + 120} 400,${icebergTop + 120} 380,${icebergTop + 80}`}
                          fill="#bae6fd"
                          stroke="#7dd3fc"
                          strokeWidth="1.5"
                        />

                        <polygon
                          points={`500,${icebergTop + 120} 540,${icebergTop + 200} 480,${icebergTop + 180}`}
                          fill="#dbeafe"
                          stroke="#93c5fd"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`500,${icebergTop + 120} 480,${icebergTop + 180} 420,${icebergTop + 80}`}
                          fill="url(#iceLight1)"
                          stroke="#bae6fd"
                          strokeWidth="1.5"
                          opacity={0.9 + lightShift * 0.25}
                        />
                        <polygon
                          points={`500,${icebergTop + 120} 400,${icebergTop + 120} 420,${icebergTop + 80}`}
                          fill="#e0f2fe"
                          stroke="#bae6fd"
                          strokeWidth="1.5"
                        />

                       
                        <polygon
                          points={`260,${icebergTop + 200} 240,${icebergTop + 280} 280,${icebergTop + 200}`}
                          fill="#38bdf8"
                          stroke="#0ea5e9"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`280,${icebergTop + 200} 320,${icebergTop + 180} 400,${icebergTop + 240}`}
                          fill="#60a5fa"
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                          opacity={0.9}
                        />
                        <polygon
                          points={`280,${icebergTop + 200} 400,${icebergTop + 240} 260,${icebergTop + 200}`}
                          fill="#7dd3fc"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                        />

                        <polygon
                          points={`540,${icebergTop + 200} 560,${icebergTop + 280} 520,${icebergTop + 200}`}
                          fill="#93c5fd"
                          stroke="#60a5fa"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`520,${icebergTop + 200} 480,${icebergTop + 180} 400,${icebergTop + 240}`}
                          fill="#bae6fd"
                          stroke="#7dd3fc"
                          strokeWidth="1.5"
                          opacity={0.95 + lightShift * 0.2}
                        />
                        <polygon
                          points={`520,${icebergTop + 200} 400,${icebergTop + 240} 540,${icebergTop + 200}`}
                          fill="#dbeafe"
                          stroke="#93c5fd"
                          strokeWidth="1.5"
                        />

                        
                        <polygon
                          points={`400,${icebergTop + 120} 320,${icebergTop + 180} 400,${icebergTop + 240}`}
                          fill="#7dd3fc"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`400,${icebergTop + 120} 480,${icebergTop + 180} 400,${icebergTop + 240}`}
                          fill="#93c5fd"
                          stroke="#60a5fa"
                          strokeWidth="1.5"
                        />

                        <polygon
                          points={`240,${icebergTop + 280} 260,${icebergTop + 200} 280,${icebergTop + 200}`}
                          fill="#0ea5e9"
                          stroke="#0284c7"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`280,${icebergTop + 200} 400,${icebergTop + 300} 260,${icebergTop + 200}`}
                          fill="#38bdf8"
                          stroke="#0ea5e9"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`560,${icebergTop + 280} 540,${icebergTop + 200} 520,${icebergTop + 200}`}
                          fill="#60a5fa"
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`520,${icebergTop + 200} 400,${icebergTop + 300} 540,${icebergTop + 200}`}
                          fill="#7dd3fc"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                        />
                      </g>

                     
                      <g opacity={0.6 + lightShift * 0.4}>
                        <ellipse
                          cx="420"
                          cy={icebergTop + 60}
                          rx="25"
                          ry="30"
                          fill="#ffffff"
                          opacity="0.5"
                        />
                        <ellipse
                          cx="390"
                          cy={icebergTop + 140}
                          rx="20"
                          ry="25"
                          fill="#f0f9ff"
                          opacity="0.4"
                        />
                      </g>
                    </g>

                  
                    <g>
                      
                      <path
                        d={`M 0 ${waterLineY}
                            Q ${100 + Math.sin(wavePhase) * 15} ${waterLineY - Math.sin(wavePhase) * 2},
                              ${200} ${waterLineY}
                            T ${400} ${waterLineY}
                            T ${600} ${waterLineY}
                            T ${800} ${waterLineY}`}
                        stroke="#22d3ee"
                        strokeWidth="3"
                        fill="none"
                        opacity="0.8"
                      />
                      <path
                        d={`M 0 ${waterLineY}
                            Q ${100 + Math.sin(wavePhase + 0.5) * 12} ${waterLineY - Math.sin(wavePhase + 0.5) * 1.5},
                              ${200} ${waterLineY}
                            T ${400} ${waterLineY}
                            T ${600} ${waterLineY}
                            T ${800} ${waterLineY}`}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.5"
                      />

                     
                      {[1, 2, 3].map((i) => (
                        <path
                          key={`wave-${i}`}
                          d={`M 0 ${waterLineY + i * 8}
                              Q ${100 + Math.sin(wavePhase + i * 0.3) * 10} ${waterLineY + i * 8 - Math.sin(wavePhase + i * 0.3) * 1},
                                ${200} ${waterLineY + i * 8}
                              T ${400} ${waterLineY + i * 8}
                              T ${600} ${waterLineY + i * 8}
                              T ${800} ${waterLineY + i * 8}`}
                          stroke="#0ea5e9"
                          strokeWidth="1.5"
                          fill="none"
                          opacity={0.3 - i * 0.07}
                        />
                      ))}
                    </g>

                   
                    <text
                      x="400"
                      y={Math.max(icebergTop - 30 + verticalBob, 50)}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="52"
                      fontWeight="bold"
                      style={{ 
                        filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.7))',
                        pointerEvents: 'none'
                      }}
                    >
                      {percentage.toFixed(0)}%
                    </text>
                  </svg>

                 
                  <div className="absolute top-6 left-6 space-y-3 pointer-events-none">
                    <Badge className="bg-slate-800/80 text-cyan-100 border-cyan-400/40 backdrop-blur-md px-4 py-2 text-base shadow-lg">
                      ⬆️ Над водой: {visiblePercentage.toFixed(1)}%
                    </Badge>
                    <Badge className="bg-blue-900/70 text-cyan-200 border-blue-400/40 backdrop-blur-md px-4 py-2 text-base shadow-lg">
                      ⬇️ Под водой: {(100 - visiblePercentage).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          
          <div className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-2 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-100 text-sm">Параметры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-200/70">Высота над водой</span>
                  <span className="text-cyan-100">{(visiblePercentage * 6).toFixed(1)}м</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-200/70">Глубина под водой</span>
                  <span className="text-cyan-100">{((100 - visiblePercentage) * 6).toFixed(1)}м</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-200/70">Общая высота</span>
                  <span className="text-cyan-100">600м</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

       
        <Card className="mt-8 bg-slate-800/50 backdrop-blur-md border-2 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <Crown className="w-5 h-5 text-cyan-400" />
              Вехи прогресса и звания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {RANKS.map((rank, index) => {
                const isAchieved = totalPoints >= rank.minPoints;
                const isCurrent = current.name === rank.name;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400/60 shadow-lg shadow-cyan-500/20'
                        : isAchieved
                        ? 'bg-slate-700/30 border-cyan-500/30'
                        : 'bg-slate-800/20 border-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`text-lg ${isCurrent ? 'text-cyan-100' : isAchieved ? 'text-cyan-200' : 'text-slate-500'}`}>
                        {rank.name}
                      </div>
                      {isAchieved && (
                        <Award className={`w-5 h-5 ${isCurrent ? 'text-cyan-400' : 'text-cyan-500'}`} />
                      )}
                    </div>
                    <div className={`text-sm ${isCurrent ? 'text-cyan-200' : isAchieved ? 'text-cyan-300/70' : 'text-slate-600'}`}>
                      {rank.minPoints} TethysPoints
                    </div>
                    {isCurrent && (
                      <Badge className="mt-2 bg-cyan-500 text-slate-900">
                        Текущее звание
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}