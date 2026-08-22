'use client'

import { AppShell } from '@mantine/core'
import { useConversation } from '../hooks/useConversation'
import { ChatPane } from './ChatPane'
import { ConversationNavbar } from './ConversationNavbar'

export function Explorer() {
  const {
    conversations,
    selectedConversationId,
    isDraftNewChat,
    isLoadingList,
    isLoadingTurn,
    isCreatingConversation,
    latestTurn,
    error,
    selectConversation,
    startNewChat,
    ensureConversation,
    setConversationTitle,
  } = useConversation()

  return (
    <AppShell
      mode="static"
      padding={0}
      navbar={{ width: 280, breakpoint: 'xs' }}
      h="100%"
      styles={{
        navbar: { overflow: 'hidden' },
        main: { overflow: 'hidden' },
      }}
    >
      <AppShell.Navbar>
        <ConversationNavbar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          isDraftNewChat={isDraftNewChat}
          isLoadingList={isLoadingList}
          onSelectConversation={selectConversation}
          onStartNewChat={startNewChat}
        />
      </AppShell.Navbar>
      <AppShell.Main h="100%">
        <ChatPane
          selectedConversationId={selectedConversationId}
          isDraftNewChat={isDraftNewChat}
          isLoadingTurn={isLoadingTurn}
          latestTurn={latestTurn}
          error={error}
          conversationReady={!isLoadingList}
          isCreatingConversation={isCreatingConversation}
          onEnsureConversation={ensureConversation}
          onFirstMessage={setConversationTitle}
        />
      </AppShell.Main>
    </AppShell>
  )
}
