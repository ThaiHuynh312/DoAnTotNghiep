import spacy
import json
import re
from collections import defaultdict

# Load mô hình
nlp = spacy.load("./ner_lop_mon_model")

# Load dữ liệu kiểm thử
with open("test_data.json", "r", encoding="utf-8") as f:
    test_data = json.load(f)

y_true_set = set()
y_pred_set = set()
debug_log = []

# Dùng để lưu lỗi có gắn text gốc
false_positive_detail = defaultdict(list)  # {(ent_text, label): [list câu]}
false_negative_detail = defaultdict(list)

# Lặp qua từng mẫu
for idx, sample in enumerate(test_data):
    original_text = sample["text"]
    
    # ✅ Tiền xử lý
    text = original_text.lower()
    text = re.sub(r'[.,;:?!]', ' ', text)
    text = re.sub(r'\b(xung|quanh)\b', '', text)

    doc = nlp(text)

    # ✅ TRUE entities
    true_entities = []
    for start, end, label in sample["entities"]:
        if label in ("MONHOC", "LOP"):
            entity_text = original_text[start:end].strip().lower()
            y_true_set.add((entity_text, label))
            true_entities.append((entity_text, label))

    # ✅ PREDICTED entities
    pred_entities = []
    for ent in doc.ents:
        if ent.label_ in ("MONHOC", "LOP"):
            entity_text = ent.text.strip().lower()
            y_pred_set.add((entity_text, ent.label_))
            pred_entities.append((entity_text, ent.label_))

    # ✅ Lưu 5 mẫu đầu để kiểm tra
    if idx < 5:
        debug_log.append({
            "text": original_text,
            "true_entities": true_entities,
            "pred_entities": pred_entities
        })

# So sánh
true_positives = y_true_set & y_pred_set
false_positives = y_pred_set - y_true_set
false_negatives = y_true_set - y_pred_set

# Gán text gốc cho thực thể sai
for sample in test_data:
    original_text = sample["text"]
    text = original_text.lower()
    text = re.sub(r'[.,;:?!]', ' ', text)
    text = re.sub(r'\b(xung|quanh)\b', '', text)
    doc = nlp(text)

    # False positive
    for ent in doc.ents:
        if ent.label_ in ("MONHOC", "LOP"):
            ent_text = ent.text.strip().lower()
            ent_pair = (ent_text, ent.label_)
            if ent_pair in false_positives:
                false_positive_detail[ent_pair].append(original_text)

    # False negative
    for start, end, label in sample["entities"]:
        if label in ("MONHOC", "LOP"):
            ent_text = original_text[start:end].strip().lower()
            ent_pair = (ent_text, label)
            if ent_pair in false_negatives:
                false_negative_detail[ent_pair].append(original_text)

# Metrics
precision = len(true_positives) / len(y_pred_set) if y_pred_set else 0
recall = len(true_positives) / len(y_true_set) if y_true_set else 0
f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0

# Ghi báo cáo
with open("ner_evaluation_report.txt", "w", encoding="utf-8") as f:
    f.write(f"Precision: {precision*100:.2f}%\n")
    f.write(f"Recall: {recall*100:.2f}%\n")
    f.write(f"F1-score: {f1*100:.2f}%\n\n")

    f.write("\n=== Tổng hợp thực thể ===\n")
    f.write(f"\nTrue positives ({len(true_positives)}):\n")
    for item in sorted(true_positives):
        f.write(f"  {item}\n")

    f.write(f"\nFalse positives ({len(false_positives)}):\n")
    for item in sorted(false_positives):
        f.write(f"  {item}\n")

    f.write(f"\nFalse negatives ({len(false_negatives)}):\n")
    for item in sorted(false_negatives):
        f.write(f"  {item}\n")

    f.write("\n=== Chi tiết các thực thể sai ===\n")

    f.write("\nChi tiết False Positives (Dự đoán sai):\n")
    for item, sentences in false_positive_detail.items():
        f.write(f"  {item} xuất hiện trong:\n")
        for sent in sentences:
            f.write(f"    - {sent}\n")

    f.write("\nChi tiết False Negatives (Bỏ sót):\n")
    for item, sentences in false_negative_detail.items():
        f.write(f"  {item} bị bỏ sót trong:\n")
        for sent in sentences:
            f.write(f"    - {sent}\n")

print("✅ Đánh giá hoàn tất. Kết quả đầy đủ đã lưu vào 'ner_evaluation_report.txt'")
