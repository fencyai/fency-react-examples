'use client'

import { Stack, Text, Title } from '@mantine/core'
import Uppy from '@uppy/core'
import { UppyContextProvider } from '@uppy/react'
import XHRUpload from '@uppy/xhr-upload'
import { useEffect, useRef, useState } from 'react'
import {
  analyzedDocumentSchema,
  type AnalyzedDocument,
} from '../analyzedDocument'
import { PdfDropField } from './PdfDropField'

function createUploadUppy() {
  return new Uppy({
    autoProceed: true,
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['.pdf', 'application/pdf'],
    },
  }).use(XHRUpload, {
    endpoint: '/document-analysis/api/upload-document',
    fieldName: 'file',
    withCredentials: true,
    allowedMetaFields: false,
  })
}

export function DocumentUploader({
  onUploaded,
  onError,
}: {
  onUploaded: (document: AnalyzedDocument) => void
  onError: (message: string) => void
}) {
  const onUploadedRef = useRef(onUploaded)
  const onErrorRef = useRef(onError)
  const [uppy, setUppy] = useState<Uppy | null>(null)

  useEffect(() => {
    onUploadedRef.current = onUploaded
    onErrorRef.current = onError
  })

  useEffect(() => {
    const instance = createUploadUppy()

    instance.on('upload-success', (_file, response) => {
      const document = analyzedDocumentSchema.parse(response.body)
      onUploadedRef.current(document)
      instance.clear()
    })

    instance.on('upload-error', (_file, error) => {
      onErrorRef.current(error.message || 'Failed to upload document.')
    })

    instance.on('restriction-failed', (_file, error) => {
      onErrorRef.current(error.message)
    })

    setUppy(instance)
    return () => {
      instance.destroy()
      setUppy(null)
    }
  }, [])

  return (
    <Stack gap="sm">
      <div>
        <Title order={2} size="h5">
          Upload a PDF
        </Title>
        <Text size="sm" c="dimmed">
          Drop a PDF or click to browse. The server creates a FILE memory
          and waits for a memory.updated webhook before analysis can run.
        </Text>
      </div>
      {uppy ? (
        <UppyContextProvider uppy={uppy}>
          <PdfDropField />
        </UppyContextProvider>
      ) : null}
    </Stack>
  )
}
