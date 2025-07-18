import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { BookOpen, Code, Lightbulb, Target, Layers, Shield, ArrowRight, Github, ExternalLink } from 'lucide-react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('overview')

  const principles = [
    {
      id: 'dry',
      name: 'DRY',
      fullName: "Don't Repeat Yourself",
      icon: <Target className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Avoid duplication of code, logic, or data. Every piece of knowledge should have a single, unambiguous representation.',
      benefits: ['Maintainability', 'Readability', 'Reduced Bugs', 'Faster Development']
    },
    {
      id: 'kiss',
      name: 'KISS',
      fullName: 'Keep It Simple, Stupid',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Simplicity should be a key goal in design. Avoid unnecessary complexity and over-engineering.',
      benefits: ['Readability', 'Reduced Bugs', 'Faster Development', 'Easier Maintenance']
    },
    {
      id: 'srp',
      name: 'SRP',
      fullName: 'Single Responsibility Principle',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'A class should have only one reason to change. Each module should have responsibility over a single part of functionality.',
      benefits: ['Modularity', 'Maintainability', 'Testability', 'Clarity']
    },
    {
      id: 'solid',
      name: 'SOLID',
      fullName: 'SOLID Principles',
      icon: <Layers className="w-6 h-6" />,
      color: 'bg-orange-500',
      description: 'Five design principles (SRP, OCP, LSP, ISP, DIP) that make software designs more understandable, flexible, and maintainable.',
      benefits: ['Robustness', 'Flexibility', 'Maintainability', 'Testability']
    }
  ]

  const exercises = [
    {
      principle: 'DRY',
      title: 'Data Validation',
      language: 'Python',
      scenario: 'User Registration and Profile Update',
      difficulty: 'Beginner'
    },
    {
      principle: 'DRY',
      title: 'API Response Formatting',
      language: 'Node.js/Next.js',
      scenario: 'Consistent API Response Structure',
      difficulty: 'Beginner'
    },
    {
      principle: 'KISS',
      title: 'Order Processing Logic',
      language: 'Python',
      scenario: 'Complex Discount Calculation',
      difficulty: 'Intermediate'
    },
    {
      principle: 'KISS',
      title: 'Frontend Form Handling',
      language: 'Node.js/Next.js',
      scenario: 'Checkout Form Validation',
      difficulty: 'Intermediate'
    },
    {
      principle: 'SRP',
      title: 'User Management',
      language: 'Python',
      scenario: 'Overloaded User Class',
      difficulty: 'Intermediate'
    },
    {
      principle: 'SRP',
      title: 'API Request Handling',
      language: 'Node.js/Next.js',
      scenario: 'Overloaded API Route Handler',
      difficulty: 'Intermediate'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Programming Principles</h1>
                <p className="text-sm text-muted-foreground">DRY, KISS, SRP & SOLID for E-commerce</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Interactive Exercises</Badge>
              <Button variant="outline" size="sm" onClick={() => window.open('https://github.com/prabodh-dev1/programming-principles', '_blank')}>
                <Github className="w-4 h-4 mr-2" />
                View Source
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="principles">Principles</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Master Programming Principles
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Learn DRY, KISS, SRP, and SOLID principles through practical e-commerce examples in Python and Node.js/Next.js
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {principles.map((principle) => (
                <Card key={principle.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 ${principle.color} rounded-lg flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      {principle.icon}
                    </div>
                    <CardTitle className="text-lg">{principle.name}</CardTitle>
                    <CardDescription className="text-sm">{principle.fullName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{principle.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Key Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {principle.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Ready to Start Learning?</h3>
                    <p className="text-muted-foreground mb-4">
                      Explore interactive exercises with real-world e-commerce scenarios
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => setActiveSection('exercises')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Start Exercises
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Principles Tab */}
          <TabsContent value="principles" className="space-y-6">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold">Programming Principles</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Deep dive into each principle with detailed explanations and real-world applications
              </p>
            </div>

            <div className="grid gap-6">
              {principles.map((principle, index) => (
                <Card key={principle.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${principle.color} rounded-lg flex items-center justify-center text-white`}>
                        {principle.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{principle.fullName} ({principle.name})</CardTitle>
                        <CardDescription>Essential principle #{index + 1}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-6">{principle.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-blue-500" />
                          Key Benefits
                        </h4>
                        <ul className="space-y-2">
                          {principle.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                          E-commerce Applications
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• User management systems</li>
                          <li>• Product catalog handling</li>
                          <li>• Order processing workflows</li>
                          <li>• Payment gateway integration</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-6">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold">Interactive Exercises</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Practice with real-world e-commerce scenarios in Python and Node.js/Next.js
              </p>
            </div>

            <div className="grid gap-4">
              {exercises.map((exercise, index) => (
                <Card key={index} className="group hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-mono">
                            {exercise.principle}
                          </Badge>
                          <Badge variant="secondary">
                            {exercise.language}
                          </Badge>
                          <Badge 
                            variant={exercise.difficulty === 'Beginner' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {exercise.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => window.open('https://github.com/prabodh-dev1/programming-principles/blob/main/README.md', '_blank')}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg mb-2">{exercise.title}</h3>
                      <p className="text-muted-foreground text-sm">{exercise.scenario}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Complete Exercise Collection</h3>
                <p className="text-muted-foreground mb-4">
                  Access the full document with detailed explanations, code examples, and solutions
                </p>
                <Button variant="outline" className="mr-4" onClick={() => window.open('https://github.com/prabodh-dev1/programming-principles/blob/main/README.md', '_blank')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Full Document
                </Button>
                <Button onClick={() => window.open('https://github.com/prabodh-dev1/programming-principles', '_blank')}>
                  <Github className="w-4 h-4 mr-2" />
                  Download Examples
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold">Additional Resources</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Further reading and tools to deepen your understanding
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                    Recommended Reading
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Clean Code</h4>
                      <p className="text-sm text-muted-foreground">by Robert C. Martin</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">The Pragmatic Programmer</h4>
                      <p className="text-sm text-muted-foreground">by Andrew Hunt & David Thomas</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Design Patterns</h4>
                      <p className="text-sm text-muted-foreground">by Gang of Four</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2 text-green-500" />
                    Tools & Frameworks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">ESLint</h4>
                      <p className="text-sm text-muted-foreground">Code quality and consistency</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Prettier</h4>
                      <p className="text-sm text-muted-foreground">Code formatting</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">SonarQube</h4>
                      <p className="text-sm text-muted-foreground">Code quality analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This interactive guide was created to help developers understand and apply fundamental programming principles 
                  through practical e-commerce examples. The exercises are designed to be hands-on and immediately applicable 
                  to real-world development scenarios.
                </p>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Created with React, Tailwind CSS, and shadcn/ui
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">Open Source</Badge>
                    <Badge variant="outline">Educational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Programming Principles Guide. Built for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

