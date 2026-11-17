import { useEffect, useRef } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import {
  HighlightStyle,
  bracketMatching,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { tags } from '@lezer/highlight';

interface PythonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  darkMode: boolean;
  fontSize?: number;
  minHeight?: string;
}

const lightHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#0369a1', fontWeight: '600' },
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: '#0f172a' },
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#0284c7' },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#b45309' },
  { tag: [tags.definition(tags.name), tags.separator], color: '#0f172a' },
  { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#7c3aed' },
  { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link], color: '#0f766e' },
  { tag: [tags.meta, tags.comment], color: '#64748b', fontStyle: 'italic' },
  { tag: tags.string, color: '#047857' },
  { tag: tags.bool, color: '#b45309', fontWeight: '600' },
]);

const darkHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#38bdf8', fontWeight: '600' },
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: '#e2e8f0' },
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#7dd3fc' },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#fbbf24' },
  { tag: [tags.definition(tags.name), tags.separator], color: '#e2e8f0' },
  { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#c4b5fd' },
  { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link], color: '#5eead4' },
  { tag: [tags.meta, tags.comment], color: '#94a3b8', fontStyle: 'italic' },
  { tag: tags.string, color: '#34d399' },
  { tag: tags.bool, color: '#fbbf24', fontWeight: '600' },
]);

function buildTheme(darkMode: boolean, fontSize: number, minHeight: string) {
  return EditorView.theme(
    {
      '&': {
        backgroundColor: darkMode ? '#0b1120' : '#ffffff',
        color: darkMode ? '#e2e8f0' : '#0f172a',
        fontSize: `${fontSize}px`,
        fontFamily: 'var(--font-mono)',
        minHeight,
        height: '100%',
      },
      '.cm-scroller': {
        overflow: 'auto',
        lineHeight: '1.65',
        paddingTop: '10px',
        paddingBottom: '10px',
      },
      '.cm-content': {
        caretColor: darkMode ? '#38bdf8' : '#0284c7',
        paddingRight: '16px',
      },
      '.cm-gutters': {
        backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
        color: darkMode ? '#64748b' : '#94a3b8',
        borderRight: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
        minWidth: '44px',
        userSelect: 'none',
      },
      '.cm-activeLineGutter': {
        backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
        color: darkMode ? '#e2e8f0' : '#0f172a',
      },
      '.cm-activeLine': {
        backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.45)' : 'rgba(241, 245, 249, 0.8)',
      },
      '.cm-selectionBackground, ::selection': {
        backgroundColor: darkMode ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.16)',
      },
      '&.cm-focused': {
        outline: 'none',
      },
    },
    { dark: darkMode },
  );
}

export function PythonEditor({
  value,
  onChange,
  onRun,
  darkMode,
  fontSize = 14,
  minHeight = '320px',
}: PythonEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeCompartment = useRef(new Compartment());
  const highlightCompartment = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);

  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  useEffect(() => {
    if (!containerRef.current) return;

    const runShortcut = keymap.of([
      {
        key: 'Mod-Enter',
        run: () => {
          onRunRef.current?.();
          return true;
        },
      },
    ]);

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        drawSelection(),
        indentOnInput(),
        indentUnit.of('    '),
        bracketMatching(),
        closeBrackets(),
        python(),
        runShortcut,
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
        themeCompartment.current.of(buildTheme(darkMode, fontSize, minHeight)),
        highlightCompartment.current.of(
          syntaxHighlighting(darkMode ? darkHighlightStyle : lightHighlightStyle),
        ),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  // Sync theme / fontSize updates without losing cursor state
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: [
        themeCompartment.current.reconfigure(buildTheme(darkMode, fontSize, minHeight)),
        highlightCompartment.current.reconfigure(
          syntaxHighlighting(darkMode ? darkHighlightStyle : lightHighlightStyle),
        ),
      ],
    });
  }, [darkMode, fontSize, minHeight]);

  // Sync external value changes (lesson switch, reset, load snippet)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden"
      aria-label="Python 程式碼編輯器"
    />
  );
}
