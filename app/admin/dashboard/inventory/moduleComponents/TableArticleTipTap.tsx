

import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import { Button } from '@mui/material'
import "./stylesTableArticlesTipTap.css"

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-background-color'),
        renderHTML: attributes => {
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
    }
  },
})

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        Insertar tabla
      </Button>

      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()}>
        Agregar columna antes
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()}>
        Agregar columna después
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()}>
        Eliminar columna
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()}>
        Agregar fila antes
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()}>
        Agregar fila después
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()}>
        Eliminar fila
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()}>
        Eliminar tabla
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()}>
        Unir celdas
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()}>
        Dividir celda
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().toggleHeaderColumn().run()} disabled={!editor.can().toggleHeaderColumn()}>
        Alternar columna de encabezado
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().toggleHeaderRow().run()} disabled={!editor.can().toggleHeaderRow()}>
        Alternar fila de encabezado
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().toggleHeaderCell().run()} disabled={!editor.can().toggleHeaderCell()}>
        Alternar celda de encabezado
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().mergeOrSplit().run()} disabled={!editor.can().mergeOrSplit()}>
        Unir o dividir
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', '#FAF594').run()} disabled={!editor.can().setCellAttribute('backgroundColor', '#FAF594')}>
        Establecer color de fondo
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().fixTables().run()} disabled={!editor.can().fixTables()}>
        Corregir tabla
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().goToNextCell().run()} disabled={!editor.can().goToNextCell()}>
        Ir a la siguiente celda
      </Button>
      <Button sx={{ margin: 1, width: 250 }} variant="contained" onClick={() => editor.chain().focus().goToPreviousCell().run()} disabled={!editor.can().goToPreviousCell()}>
        Ir a la celda anterior
      </Button>


    </div>
  )
}

export default function TableArticleTipTap({ edit = true, onUpdate, oldContent }: { oldContent: string, edit?: boolean, onUpdate?: any }) {

  useEffect(() => {
    const existing = document.getElementById('tiptap-stylesheet')

    if (!edit) {
      if (!existing) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = '/stylesTableArticlesTipTapPublic.css'
        link.id = 'tiptap-stylesheet'
        document.head.appendChild(link)
      }
    } else {
      // Si ya existe el link, lo removemos
      if (existing) {
        existing.remove()
      }
    }
  }, [edit])

  const [content, setContent] = React.useState(
    oldContent ? oldContent : ` <table>
        <tbody>
          <tr>
            <th colwidth="200">Artículo</th>
            <th colspan="3" colwidth="150,100">Descripción</th>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    `,
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
    ],
    content: content,
    onUpdate({ editor }) {

      const content = editor.getHTML()
      setContent(content)  // <-- aquí capturas el HTML actualizado

      if (onUpdate) {
        onUpdate(content)
      }
    }
  })

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}