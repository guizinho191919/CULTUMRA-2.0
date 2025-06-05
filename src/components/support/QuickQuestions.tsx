
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickQuestionsProps {
  onSelectQuestion: (question: string) => void;
  visible: boolean;
}

const QuickQuestions = ({ onSelectQuestion, visible }: QuickQuestionsProps) => {
  const quickQuestions = [
    "Como fazer uma reserva?",
    "Política de cancelamento",
    "Formas de pagamento",
    "Problemas com o app"
  ];

  if (!visible) return null;

  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Perguntas Frequentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickQuestions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left h-auto py-2.5 px-3"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickQuestions;
