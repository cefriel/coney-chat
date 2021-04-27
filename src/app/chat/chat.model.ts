export interface ChatMessage {
    type: string,
    subtype: string | undefined,
    visualization: string | undefined,
    url: string | undefined,
    text: string | undefined,
    imageUrl: string | undefined
}

export interface AnswersToDisplay {
    subtype: string | undefined,
    visualization: string | undefined,
    questionId: number,
    answers: any[]
}