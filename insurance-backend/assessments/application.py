class AssessmentService:

    @staticmethod
    def create_assessment(serializer):

        assessment = serializer.save()

        from .tasks import run_assessment_task

        run_assessment_task.delay(
            assessment.id
        )

        return assessment
