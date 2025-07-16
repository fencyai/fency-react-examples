import { useChatCompletion } from '@fencyai/react'

export default function SynchronousChatCompletion() {
    const chatCompletions = useChatCompletion()

    const handleClick = async () => {
        await chatCompletions.createSynchronousChatCompletion({
            model: 'gpt-4o-mini',
            prompt: 'Hello, how are you?',
        })
    }

    return (
        <div>
            <button onClick={handleClick}>Send Message</button>
            <div>{chatCompletions.latestCompletion?.fullMessage}</div>
        </div>
    )
}
