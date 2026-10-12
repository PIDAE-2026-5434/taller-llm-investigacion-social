"""Comprueba que cada cita de grilla.csv aparezca textual en el turno indicado.

Uso: python verificar_citas.py grilla.csv transcripcion1.txt [transcripcion2.txt ...]

El material de cada fila tiene que coincidir con el nombre de un archivo de
transcripción, sin la extensión. Imprime las filas que no se encontraron.
"""
import csv
import re
import sys
from pathlib import Path


def normal(texto):
    texto = texto.lower().replace("“", "").replace("”", "").replace('"', "")
    return re.sub(r"\s+", " ", texto).strip()


def turnos(ruta):
    salida = {}
    for linea in Path(ruta).read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\[(\d+)\]\s*(?:[A-Z][A-Z0-9]{0,3}:\s*)?(.*)$", linea)
        if m:
            salida[m.group(1)] = normal(m.group(2))
    return salida


def main():
    grilla, *transcripciones = sys.argv[1:]
    materiales = {Path(t).stem: turnos(t) for t in transcripciones}
    total, fallas = 0, []
    with open(grilla, encoding="utf-8") as f:
        for fila in csv.DictReader(f):
            total += 1
            texto = materiales.get(fila["material"], {}).get(fila["turno"].strip(), "")
            partes = [p for p in re.split(r"\s*(?:\.\.\.|…)\s*", normal(fila["cita"])) if p]
            if not texto or not all(p in texto for p in partes):
                fallas.append(fila)
    print(f"Filas: {total}. Citas no encontradas en el turno indicado: {len(fallas)}.")
    for fila in fallas:
        print(f"- {fila['material']} [{fila['turno']}] {fila['hablante']}: {fila['cita']}")


if __name__ == "__main__":
    main()
