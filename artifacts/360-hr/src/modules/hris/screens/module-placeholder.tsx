import { Text } from "@/shared/colors/typography";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type ModulePlaceholderProps = {
  title: string;
  description: string;
  estimatedScreens?: string;
};

export function ModulePlaceholder({
  title,
  description,
  estimatedScreens,
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary" className="mb-3">
          HRIS · Module 1
        </Badge>
        <h1 className="text-h2">{title}</h1>
        <Text variant="text2" className="mt-2 max-w-2xl text-muted-foreground">
          {description}
        </Text>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Awaiting Figma screens</CardTitle>
          <CardDescription>
            This route is reserved in the app map.
            {estimatedScreens ? ` Estimated: ${estimatedScreens} screens.` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-body-2 text-muted-foreground">
          Share Figma for this section and we will replace this placeholder with
          production UI using the design system.
        </CardContent>
      </Card>
    </div>
  );
}
