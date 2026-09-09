from rest_framework import serializers


class TrendSerializer(serializers.Serializer):
    value = serializers.FloatField()
    type = serializers.CharField()
    label = serializers.CharField()


class RecommendationSerializer(serializers.Serializer):
    AUTO_APPROVE = serializers.IntegerField(default=0)
    MANUAL_REVIEW = serializers.IntegerField(default=0)
    AUTO_REJECT = serializers.IntegerField(default=0)


class DashboardAnalyticsSerializer(serializers.Serializer):

    properties = serializers.IntegerField()
    property_trend = TrendSerializer()

    assessments = serializers.IntegerField()
    assessment_trend = TrendSerializer()

    average_flood_percent = serializers.FloatField()
    average_flood_trend = TrendSerializer()

    high_risk = serializers.IntegerField()
    high_risk_trend = TrendSerializer()

    recommendations = RecommendationSerializer()




