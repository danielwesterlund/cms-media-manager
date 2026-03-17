import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function EmptyPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No assets yet</CardTitle>
        <CardDescription>Upload your first media file to start building your library.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Upload Asset</Button>
      </CardContent>
    </Card>
  );
}
