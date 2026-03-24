import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-105 border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="text-primary w-5 h-5" />
          </div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      {description && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </CardContent>
      )}
    </Card>
  );
};

export default FeatureCard;
  