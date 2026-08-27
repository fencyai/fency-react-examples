'use client'

import { Paper, Text } from '@mantine/core'
import { useDropzone, useUppyContext } from '@uppy/react'

export function PdfDropField() {
  const { getRootProps, getInputProps } = useDropzone()
  const { status, progress } = useUppyContext()
  const uploading = status === 'uploading'

  return (
    <Paper
      withBorder
      p="xl"
      radius="lg"
      style={{ cursor: 'pointer' }}
      {...getRootProps()}
    >
      <input {...getInputProps()} style={{ display: 'none' }} />
      <Text size="sm" ta="center">
        {uploading
          ? `Uploading... ${progress}%`
          : 'Drop a PDF here or click to browse'}
      </Text>
    </Paper>
  )
}
