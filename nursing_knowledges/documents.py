from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from .models import DiseaseSmallCategory


@registry.register_document
class DiseaseDocument(Document):
    class Index:
        # Name of the Elasticsearch index
        name = 'diseases'
        # See Elasticsearch Indices API reference for available settings
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 1}

    class Django:
        model = DiseaseSmallCategory # The model associated with this Document

        # The fields of the model you want to be indexed in Elasticsearch
        fields = [
            'id',
            'name',
        ]

        # Ignore auto updating of Elasticsearch when a model is saved
        # or deleted:
        # ignore_signals = True

        # Don't perform an index refresh after every update (overrides global setting):
        # auto_refresh = False

        # Paginate the django queryset used to populate the index with the specified size
        # (by default it uses the database driver's default setting)
        # queryset_pagination = 5000