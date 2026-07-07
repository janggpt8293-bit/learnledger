import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Image } from '@/components/ui/image';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Projects | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    
    try {
      const data = await BaseCrudService.getById<Projects>('projects', id);
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="w-full max-w-[100rem] mx-auto px-8 py-20">
        <div style={{ minHeight: isLoading ? '600px' : 'auto' }}>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : !project ? (
            <div className="text-center py-20">
              <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
                Project Not Found
              </h1>
              <p className="font-paragraph text-lg text-secondary mb-8">
                The project you're looking for doesn't exist.
              </p>
              <Link to="/projects">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                </Button>
              </Link>
            </div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <Link to="/projects">
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-transparent mb-8 -ml-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                </Button>
              </Link>

              {project.mainImage && (
                <div className="aspect-video bg-secondary/10 mb-12 rounded-lg overflow-hidden">
                  <Image src={project.mainImage} alt={project.projectName || 'Project'} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="mb-8">
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  {project.projectStatus}
                </span>
                {project.completionDate && (
                  <span className="text-sm text-muted-foreground ml-4">
                    {format(new Date(project.completionDate), 'MMMM yyyy')}
                  </span>
                )}
              </div>

              <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-8">
                {project.projectName}
              </h1>

              {project.shortDescription && (
                <p className="font-paragraph text-xl text-secondary mb-12 leading-relaxed">
                  {project.shortDescription}
                </p>
              )}

              {project.projectUrl && (
                <div className="mb-12">
                  <a 
                    href={project.projectUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      View Project <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              )}

              <div className="border-t border-border pt-12">
                <div className="font-paragraph text-base text-foreground leading-relaxed whitespace-pre-wrap">
                  {project.detailedContent}
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
