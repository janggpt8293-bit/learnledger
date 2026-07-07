import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  const skills = [
    'AI & Machine Learning',
    'Data Analytics',
    'Statistics',
    'Python',
    'Data Visualization',
    'Analytical Thinking',
    'Lifelong Learning',
    'Systems Thinking'
  ];

  const principles = [
    {
      title: 'Learn in Public',
      description: 'Documenting the journey, sharing insights, and building a body of work that tracks growth over time.'
    },
    {
      title: 'Build to Understand',
      description: 'Creating projects and tools to apply theoretical knowledge in practical, real-world scenarios.'
    },
    {
      title: 'Think Through Systems',
      description: 'Approaching problems analytically, breaking down complexity, and finding patterns across domains.'
    },
    {
      title: 'Stay Curious',
      description: 'Maintaining intellectual curiosity, asking questions, and pursuing understanding beyond surface-level knowledge.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="w-full max-w-[100rem] mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6">
            About
          </h1>
          <p className="font-paragraph text-xl text-secondary max-w-3xl mb-16">
            A student on a long-term journey to build expertise in AI, analytics, and analytical thinking.
          </p>

          {/* Bio Section */}
          <section className="mb-20">
            <div className="max-w-4xl">
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8">
                The Journey
              </h2>
              <div className="space-y-6 font-paragraph text-base text-foreground leading-relaxed">
                <p>
                  This website exists to document a long-term learning journey. It's not about claiming expertise or selling a product. It's about building skills systematically, thinking deeply, and sharing the process publicly.
                </p>
                <p>
                  I'm a student focused on developing capabilities in artificial intelligence and data analytics. The goal is to understand these domains deeply, build practical projects, and document insights along the way.
                </p>
                <p>
                  Every article, project, and progress update represents a step in this journey. Some ideas will be refined over time. Some projects will evolve. That's the nature of learning in public—it's messy, iterative, and honest.
                </p>
                <p>
                  This is not a portfolio of perfection. It's a laboratory for continuous improvement.
                </p>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="mb-20">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8">
              Areas of Focus
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="p-6 border border-border bg-background text-center">
                    <p className="font-paragraph text-sm font-medium text-foreground">
                      {skill}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Principles Section */}
          <section className="mb-20">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8">
              Guiding Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
              {principles.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-8 border border-border bg-background h-full">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                      {principle.title}
                    </h3>
                    <p className="font-paragraph text-base text-secondary">
                      {principle.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Philosophy Section */}
          <section>
            <div className="max-w-4xl">
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8">
                Philosophy
              </h2>
              <div className="space-y-6 font-paragraph text-base text-foreground leading-relaxed">
                <p>
                  I believe in the power of consistent, deliberate practice. Expertise isn't built overnight—it's the result of showing up daily, tackling difficult problems, and refining understanding over time.
                </p>
                <p>
                  This website reflects that philosophy. It's a commitment to transparency, intellectual honesty, and the long game of skill development.
                </p>
                <p>
                  If you're on a similar journey, I hope this serves as inspiration or a useful resource. If you have feedback, questions, or want to connect, feel free to reach out through the contact form.
                </p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
