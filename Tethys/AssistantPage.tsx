import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Brain, Globe, Target, Trophy, Sparkles, Calendar, MapPin } from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { toast } from 'sonner@2.0.3';
import { getUniversityRecommendations } from '../utils/gemini';
import { useAuth } from '../contexts/AuthContext';

interface University {
  name: string;
  location: string;
  probability: number;
  programs: string[];
  requirements: string[];
}

interface Competition {
  name: string;
  location: string;
  date: string;
  category: string;
  level: string;
}

type Region = 'asia' | 'central-asia' | 'north-america' | 'europe' | 'south-america' | 'oceania';

const RegionIcon = ({ type }: { type: Region }) => {
  const icons = {
    'asia': (<svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22" stroke="currentColor" strokeWidth="2"/><path d="M12 2C12 2 16 6 16 12C16 18 12 22 12 22" stroke="currentColor" strokeWidth="2"/><path d="M2 12H22" stroke="currentColor" strokeWidth="2"/></svg>),
    'central-asia': (<svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><path d="M3 20L12 4L21 20H3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M7 20L12 10L17 20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>),
    'north-america': (<svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><rect x="8" y="8" width="8" height="14" stroke="currentColor" strokeWidth="2"/><path d="M8 8L12 2L16 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2"/></svg>),
    'europe': (<svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><rect x="6" y="10" width="12" height="10" stroke="currentColor" strokeWidth="2"/><path d="M6 10L12 4L18 10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><line x1="9" y1="14" x2="11" y2="14" stroke="currentColor" strokeWidth="2"/><line x1="13" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="2"/></svg>),
    'south-america': (<svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2"/><path d="M9 11C9 11 8 14 8 18C8 20 10 22 12 22C14 22 16 20 16 18C16 14 15 11 15 11" stroke="currentColor" strokeWidth="2"/></svg>),
    'oceania': (<svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><path d="M4 18C4 18 8 16 12 16C16 16 20 18 20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="10" r="1" fill="currentColor"/><circle cx="17" cy="12" r="1" fill="currentColor"/><circle cx="10" cy="14" r="0.5" fill="currentColor"/></svg>)
  };
  return icons[type];
};

export function AssistantPage() {
  const { activeUserId } = useAuth();
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);

  const regions: { id: Region; name: string }[] = [
    { id: 'asia', name: 'Азия' },
    { id: 'central-asia', name: 'Средняя Азия' },
    { id: 'north-america', name: 'Северная Америка' },
    { id: 'europe', name: 'Европа' },
    { id: 'south-america', name: 'Южная Америка' },
    { id: 'oceania', name: 'Океания' },
  ];

  const toggleRegion = (regionId: Region) => {
    setSelectedRegions(prev =>
      prev.includes(regionId) ? prev.filter(r => r !== regionId) : [...prev, regionId]
    );
  };

  const selectAllRegions = () => {
    if (selectedRegions.length === regions.length) {
      setSelectedRegions([]);
    } else {
      setSelectedRegions(regions.map(r => r.id));
    }
  };

  const handleAnalyze = async () => {
    if (selectedRegions.length === 0) {
      toast.error('Выбери хотя бы один регион');
      return;
    }

    setAnalyzing(true);
    try {
      const regionNames = selectedRegions.map(r => regions.find(reg => reg.id === r)?.name || r);
      const recommendations = await getUniversityRecommendations(regionNames, {
        direction: undefined,
        ieltsScore: undefined,
        satScore: undefined,
        gpa: undefined,
        achievements: undefined,
      });
      setUniversities(recommendations.length > 0 ? recommendations : mockUniversities);
      setAnalyzed(true);
      toast.success('Анализ завершён!');
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error('Ошибка AI. Используем примерные данные.');
      setUniversities(mockUniversities);
      setAnalyzed(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const mockUniversities: University[] = [
    { name: 'МГУ', location: 'Россия, Москва', probability: 85, programs: ['Математика', 'CS'], requirements: ['ЕГЭ 90+'] },
    { name: 'NUS', location: 'Сингапур', probability: 78, programs: ['CS', 'Data Science'], requirements: ['IELTS 7+', 'SAT 1400+'] },
    { name: 'MIT', location: 'США, Массачусетс', probability: 65, programs: ['CS', 'AI'], requirements: ['SAT 1550+', 'TOEFL 110+'] }
  ];

  const mockCompetitions: Competition[] = [
    { name: 'Asian Programming Contest', location: 'Онлайн', date: '20 февраля 2025', category: 'Программирование', level: 'Международный' },
    { name: 'Центральноазиатская олимпиада по математике', location: 'Алматы', date: '5 марта 2025', category: 'Математика', level: 'Региональный' },
    { name: 'Global Hackathon', location: 'Онлайн', date: '15 марта 2025', category: 'IT', level: 'Международный' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">ИИ-ментор</h1>
              <p className="text-blue-600 dark:text-blue-400">Персональные рекомендации университетов и конкурсов</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="universities" className="space-y-6">
          <TabsList className="bg-white/80 dark:bg-slate-800/80 border-2 border-blue-200 dark:border-blue-800">
            <TabsTrigger value="universities" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200"><Globe className="w-4 h-4 mr-2"/> Университеты</TabsTrigger>
            <TabsTrigger value="competitions" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200"><Trophy className="w-4 h-4 mr-2"/> Конкурсы</TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200"><Sparkles className="w-4 h-4 mr-2"/> Рекомендации</TabsTrigger>
          </TabsList>

        
          <TabsContent value="universities" className="space-y-6">
            <Card className="border-2 border-blue-300 bg-white/80 dark:bg-slate-800/80">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300">Выбери регионы поиска</CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">Где ты хочешь учиться?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {regions.map(region => (
                    <button key={region.id} onClick={() => toggleRegion(region.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${selectedRegions.includes(region.id) ? 'bg-blue-500 border-blue-600 text-white' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                      <div className="flex flex-col items-center gap-2">
                        <RegionIcon type={region.id} />
                        <span className="text-sm font-medium">{region.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={selectAllRegions}>{selectedRegions.length === regions.length ? 'Сбросить всё' : 'Выбрать всё'}</Button>
                  <Button onClick={handleAnalyze} disabled={analyzing || selectedRegions.length === 0}>
                    {analyzing ? 'Анализирую...' : 'Получить рекомендации'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {analyzed && universities.map((uni, index) => (
              <Card key={index} className="border-2 border-blue-200 bg-white/80 dark:bg-slate-800/80">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-blue-700 dark:text-blue-300">{uni.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400"><MapPin className="w-4 h-4"/>{uni.location}</div>
                    </div>
                    <Badge className="bg-blue-600 text-white">{uni.probability}% совпадение</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">Программы: {uni.programs.join(', ')}</div>
                  <div className="mb-2">Требования: {uni.requirements.join(', ')}</div>
                  <ProgressBar value={uni.probability} className="h-2"/>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {}
          <TabsContent value="competitions" className="space-y-4">
            {mockCompetitions.map((comp, index) => (
              <Card key={index} className="border-2 border-blue-200 bg-white/80 dark:bg-slate-800/80">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300">{comp.name}</CardTitle>
                  <div className="flex gap-4 text-sm text-blue-600 dark:text-blue-400">
                    <div className="flex items-center gap-1"><Calendar className="w-4 h-4"/>{comp.date}</div>
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4"/>{comp.location}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="border-blue-400 text-blue-600">{comp.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          
          <TabsContent value="recommendations" className="space-y-6">
            <Card className="border-2 border-blue-300 bg-white/80 dark:bg-slate-800/80">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2"><Target className="w-5 h-5"/> Персональный план развития</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Улучши GPA', description: 'Сосредоточься на математике и информатике', priority: 'Высокий' },
                  { title: 'Подготовься к IELTS', description: 'Цель: 7.5+', priority: 'Средний' },
                  { title: 'Участвуй в олимпиадах', description: 'Запланировано 3 конкурса', priority: 'Высокий' }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300">{item.title}</h4>
                      <Badge className={item.priority === 'Высокий' ? 'bg-blue-600 text-white' : 'bg-cyan-600 text-white'}>{item.priority}</Badge>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
