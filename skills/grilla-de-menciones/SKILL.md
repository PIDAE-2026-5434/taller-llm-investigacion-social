---
name: grilla-de-menciones
description: Arma una grilla de menciones a partir de entrevistas o grupos focales transcriptos con turnos numerados y de una lista de dimensiones. Usar cuando se pida grillar, armar una matriz de participantes por dimensiones o buscar en qué turnos aparece cada tema.
---

# Grilla de menciones

Esta skill registra dónde aparece cada dimensión en lo que dicen las personas entrevistadas. No interpreta ni saca conclusiones sobre consensos o diferencias. Eso es un paso posterior, que hace el equipo.

## Qué necesita

- Una o más transcripciones con turnos numerados, con el formato `[n] HABLANTE: texto`.
- Una lista de dimensiones con su definición. Puede ser un CSV con las columnas `codigo,definicion,incluye,excluye` o una lista en el mensaje.

Si falta la lista de dimensiones, pedila. No la inventes.

Si una transcripción tiene nombres propios, direcciones, lugares de trabajo u otros datos que identifican a una persona, avisá antes de seguir y preguntá si el material está anonimizado.

## Pasos

1. Identificá los materiales y los hablantes. Quien entrevista o modera (E, M) nunca se codifica.
2. Recorré cada turno de participante y decidí qué dimensiones aparecen. Un turno puede tener ninguna, una o varias.
3. Para cada mención registrá:
   - `material`: nombre del archivo, sin extensión
   - `turno`: número
   - `hablante`: como figura en la transcripción (I, P1, P2...)
   - `dimension`: el código, tal cual figura en la lista
   - `cita`: el fragmento que justifica la dimensión, copiado sin cambios, de 30 palabras como máximo
   - `nota`: vacía, salvo que la mención sea irónica, responda a una pregunta que ya traía la respuesta, o rechace una palabra de quien entrevista
4. Guardá todas las menciones en `grilla.csv`, una fila por mención, con las columnas `material,turno,hablante,dimension,cita,nota`.
5. Si tenés ejecución de código, corré `verificar_citas.py` con la grilla y las transcripciones. Corregí o sacá las filas cuya cita no aparezca textual en el turno indicado.
6. Armá la matriz resumida: una fila por participante, una columna por dimensión, y en cada celda los turnos donde aparece o "sin mención".

## Qué devolver

- La matriz resumida.
- La cantidad de menciones por dimensión.
- Las menciones que no entran en ninguna dimensión, con material y turno.
- Las dudas: turnos donde dudaste entre dos dimensiones.
- El archivo `grilla.csv`.

## Reglas

- La columna `cita` se copia. No se resume ni se corrige, aunque tenga errores de tipeo.
- "Sin mención" es un resultado válido. No fuerces una dimensión para llenar la celda.
- No agregues dimensiones que no están en la lista. Lo que no entra va a la lista de menciones fuera de dimensiones.
- No saques conclusiones sobre el conjunto ("todos coinciden en...").
