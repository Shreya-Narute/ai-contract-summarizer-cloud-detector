# Placeholder training script for fine-tuning a small transformer for clause detection.
# This script expects labeled data in JSONL with fields: {"text": ..., "labels": ["confidentiality", ...]}
# It demonstrates how to prepare data and fine-tune a sequence classification model using Hugging Face.
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
import json

def load_jsonl(path):
    data = []
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            data.append(json.loads(line))
    return data

def prepare_and_train(train_path, val_path):
    train = load_jsonl(train_path)
    val = load_jsonl(val_path)
    labels = ['confidentiality','indemnity','termination','payment','governing_law']
    label2id = {l:i for i,l in enumerate(labels)}

    def preprocess(x):
        return tokenizer(x['text'], truncation=True, padding='max_length', max_length=512)

    tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')
    model = AutoModelForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=len(labels))

    ds_train = Dataset.from_list([{'text':d['text'], 'label': label2id[d['labels'][0]]} for d in train if d.get('labels')])
    ds_val = Dataset.from_list([{'text':d['text'], 'label': label2id[d['labels'][0]]} for d in val if d.get('labels')])

    ds_train = ds_train.map(lambda x: tokenizer(x['text'], truncation=True, padding='max_length', max_length=512), batched=True)
    ds_val = ds_val.map(lambda x: tokenizer(x['text'], truncation=True, padding='max_length', max_length=512), batched=True)
    ds_train.set_format(type='torch', columns=['input_ids','attention_mask','label'])
    ds_val.set_format(type='torch', columns=['input_ids','attention_mask','label'])

    training_args = TrainingArguments(output_dir='./clause_model', num_train_epochs=3, per_device_train_batch_size=8, evaluation_strategy='epoch')
    trainer = Trainer(model=model, args=training_args, train_dataset=ds_train, eval_dataset=ds_val)
    trainer.train()
