import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Projects[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [statuses, setStatuses] = useState<string[]>(['All']);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedStatus === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.projectStatus === selectedStatus));
    }
  }, [selectedStatus, projects]);

  const loadProjects = async () => {
    try {
      const result = await BaseCrudService.getAll<Projects>('projects');
      const sortedProjects = result.items.sort((a, b) => {
        const dateA = a.completionDate ? new Date(a.completionDate).getTime() : 0;
        const dateB = b.completionDate ? new Date(b.completionDate).getTime() : 0;
        return dateB - dateA;
      });
      
      setProjects(sortedProjects);
      setFilteredProjects(sortedProjects);

      const uniqueStatuses = Array.from(
        new Set(sortedProjects.map(project => project.projectStatus).filter(Boolean))
      ) as string[];
      setStatuses(['All', ...uniqueStatuses]);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            Projects
          </h1>
          <p className="font-paragraph text-xl text-secondary max-w-3xl mb-12">
            Building practical tools and applications to apply learning in real-world scenarios.
          </p>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {statuses.map((status) => (
              <Button
                key={status}
                onClick={() => setSelectedStatus(status)}
                variant={selectedStatus === status ? 'default' : 'outline'}
                className={`rounded-md px-6 py-2 text-sm font-medium ${
                  selectedStatus === status
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-border text-foreground hover:border-primary/50'
                }`}
              >
                {status}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div style={{ minHeight: isLoading ? '600px' : 'auto' }}>
            {isLoading ? null : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Link to={`/projects/${project._id}`}>
                      <Card className="border border-border bg-background hover:border-primary/50 transition-colors overflow-hidden h-full flex flex-col">
                        {project.mainImage && (
                          <div className="aspect-video bg-secondary/10">
                            <Image src={project.mainImage} alt={project.projectName || 'Project'} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-8 flex flex-col flex-grow">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-medium text-primary uppercase tracking-wider">
                              {project.projectStatus}
                            </span>
                          </div>
                          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                            {project.projectName}
                          </h2>
                          <p className="font-paragraph text-base text-secondary line-clamp-3 flex-grow">
                            {project.shortDescription}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-paragraph text-lg text-muted-foreground">
                  {selectedStatus === 'All' 
                    ? 'No projects yet.' 
                    : `No projects with "${selectedStatus}" status.`}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
