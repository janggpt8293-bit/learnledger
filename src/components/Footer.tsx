export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-[100rem] mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              Learning Lab
            </h3>
            <p className="font-paragraph text-sm text-secondary max-w-md">
              Documenting the journey of continuous learning in AI and analytics.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="font-paragraph text-sm text-secondary">
              © {currentYear} Learning Lab. All rights reserved.
            </p>
            <p className="font-paragraph text-xs text-muted-foreground">
              Built with curiosity and discipline.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
