#!/usr/bin/env python3
"""Busca en el material original cada cita entre comillas de una salida del modelo.

Informa si aparece textual y en qué párrafo o turno. Las citas de menos de
cinco palabras se saltean, porque suelen ser nombres de códigos.

Uso:
    python3 scripts/verificar_citas.py <salida.txt> <material.txt> [más materiales...]
    python3 scripts/verificar_citas.py salidas/caso-1/p3-patron.txt discursos/apertura-sesiones-2026.txt

Escribe el informe en la salida estándar, en Markdown. No usa ningún modelo.
"""
import re
import sys
from pathlib import Path


def normal(texto):
    """Comparación tolerante a mayúsculas, comillas tipográficas y espacios."""
    texto = texto.lower()
    texto = re.sub(r'[“”«»"]', "", texto)
    texto = re.sub(r"[‘’]", "'", texto)
    texto = re.sub(r"[—–]", "-", texto)
    return re.sub(r"\s+", " ", texto).strip()


def bloques_de(ruta):
    """Bloques numerados del material: "[12] texto" o "[12] P3: texto"."""
    texto = Path(ruta).read_text(encoding="utf-8").replace("\r", "")
    cuerpo = "\n".join(l for l in texto.split("\n") if not l.startswith("#"))
    salida = []
    for b in re.split(r"\n(?=\[\d+\] )", cuerpo):
        m = re.match(r"^\[(\d+)\]\s*(?:([A-Z][A-Z0-9]{0,3}):\s*)?([\s\S]*)$", b)
        if m:
            salida.append(
                {"archivo": Path(ruta).name, "n": m.group(1), "hablante": m.group(2), "texto": normal(m.group(3))}
            )
    return salida


def citas_de(salida):
    """Las comillas rectas se aparean de a dos dentro de cada línea; las tipográficas, por su forma."""
    citas = []
    for linea in salida.split("\n"):
        citas += linea.split('"')[1::2]
        citas += re.findall(r"[“«]([^”»]+)[”»]", linea)
    return list(dict.fromkeys(c.strip() for c in citas if len(c.split()) >= 5))


def buscar(cita, bloques):
    """Una cita con elipsis se busca por partes, en orden, dentro del mismo bloque."""
    partes = [p for p in re.split(r"\s*(?:\[(?:\.\.\.|…)\]|\.\.\.|…)\s*", normal(cita)) if p]
    for b in bloques:
        desde = 0
        for p in partes:
            i = b["texto"].find(p, desde)
            if i < 0:
                break
            desde = i + len(p)
        else:
            return b
    return None


def corta(t):
    return t[:87] + "..." if len(t) > 90 else t


def main():
    if len(sys.argv) < 3:
        sys.exit("Uso: python3 scripts/verificar_citas.py <salida.txt> <material.txt> [...]")
    salida_ruta, *materiales = sys.argv[1:]
    bloques = [b for m in materiales for b in bloques_de(m)]
    salida = Path(salida_ruta).read_text(encoding="utf-8")
    filas = [(c, buscar(c, bloques)) for c in citas_de(salida)]
    ok = sum(1 for _, h in filas if h)
    print("# Verificación de citas\n")
    print(f"Salida: {salida_ruta}")
    print(f"Material: {', '.join(materiales)}\n")
    print(f"Citas de cinco palabras o más: {len(filas)}. Encontradas textuales: {ok}. No encontradas: {len(filas) - ok}.\n")
    print("| Cita | Resultado | Dónde |")
    print("| --- | --- | --- |")
    for cita, h in filas:
        donde = ""
        if h:
            donde = (h["archivo"] + " " if len(materiales) > 1 else "") + f"[{h['n']}]" + (f" {h['hablante']}" if h["hablante"] else "")
        print(f"| {corta(cita).replace('|', '/')} | {'textual' if h else 'NO ENCONTRADA'} | {donde} |")


if __name__ == "__main__":
    main()
