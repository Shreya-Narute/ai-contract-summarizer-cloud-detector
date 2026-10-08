from docxtpl import DocxTemplate

def generate_from_template(template_path, fields, output_path):
    doc = DocxTemplate(template_path)
    doc.render(fields)
    doc.save(output_path)
    return output_path
