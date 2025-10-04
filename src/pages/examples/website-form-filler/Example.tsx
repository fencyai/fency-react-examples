import { useStructuredChatCompletions, useWebsites } from '@fencyai/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, TextInput } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import '@uppy/core/css/style.min.css'
import '@uppy/dashboard/css/style.min.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    companyName: z.string(),
    compayOrganizationNumber: z.string(),
    companyAddress: z.string(),
})

const linkSchema = z.object({
    link: z.string().min(1).url(),
})

export default function Example() {
    const { createWebsite } = useWebsites({
        async onTextContentReady(event) {
            setFormsState('getting_form_data')
            const companyFormResponse =
                await chatCompletions.createStructuredChatCompletion({
                    responseFormat: formSchema,
                    gemini: {
                        content:
                            'Fill out the following form based on this content: ' +
                            event.textContent,
                        model: 'gemini-2.5-flash-lite-preview-06-17',
                    },
                })
            if (companyFormResponse.type === 'success') {
                companyFormData.reset(
                    companyFormResponse.data.structuredResponse
                )
                setFormsState('filling_form_success')
            } else {
                setFormsState('filling_form_error')
            }
        },
    })
    const chatCompletions = useStructuredChatCompletions()
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [formsState, setFormsState] = useState<
        | 'waiting_for_url'
        | 'scraping'
        | 'getting_form_data'
        | 'filling_form_success'
        | 'filling_form_error'
    >('waiting_for_url')
    const companyFormData = useForm({
        resolver: zodResolver(formSchema),
    })
    const linkForm = useForm({
        resolver: zodResolver(linkSchema),
        defaultValues: {
            link: 'https://www.proff.no/selskap/databutton-as/oslo/dataprogramvare-og-utvikling/IFC2LJ8009O',
        },
    })

    const submitForm = async (values: z.infer<typeof linkSchema>) => {
        setFormsState('scraping')
        await createWebsite({
            url: values.link,
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <form onSubmit={linkForm.handleSubmit(submitForm)}>
                <TextInput
                    label="Link"
                    {...linkForm.register('link')}
                    error={linkForm.formState.errors.link?.message}
                />
                <div className="flex justify-end pt-2">
                    <Button type="submit">{formsState}</Button>
                </div>
            </form>
            <form
                onSubmit={companyFormData.handleSubmit(() => {
                    setFormSubmitted(true)
                })}
            >
                <TextInput
                    label="Company Name"
                    {...companyFormData.register('companyName')}
                    error={
                        companyFormData.formState.errors.companyName?.message
                    }
                />
                <TextInput
                    label="Company Organization Number"
                    {...companyFormData.register('compayOrganizationNumber')}
                    error={
                        companyFormData.formState.errors
                            .compayOrganizationNumber?.message
                    }
                />
                <TextInput
                    label="Company Address"
                    {...companyFormData.register('companyAddress')}
                    error={
                        companyFormData.formState.errors.companyAddress?.message
                    }
                />
            </form>
            {formSubmitted && (
                <Alert
                    variant="light"
                    color="teal"
                    title="Form submitted successfully"
                    icon={<IconCheck />}
                >
                    Form submitted successfully.
                </Alert>
            )}
        </div>
    )
}
