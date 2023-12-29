import MessageElement from "./Elements/MessageElement";
import SendMessageForm from "./Elements/SendMessageForm";

export default function GroupChat() {
    return (
        <section className="flex-1 overflow-y-auto flex flex-col gap-2 mt-3 rounded border border-theme-main/25 dark:bg-theme-white-dark/50 bg-theme-white/50 p-2">
            <div className="no-scroll overflow-y-auto flex-1 flex flex-col gap-3">
                <MessageElement from="me" />
                <MessageElement from="other" />
                <MessageElement from="other" />
                <MessageElement from="me" />
                <MessageElement from="other" />
                <MessageElement from="other" />
                <MessageElement from="me" />
                <MessageElement from="me" />
                <MessageElement from="other" />
                <MessageElement from="other" />
                <MessageElement from="me" />
                <MessageElement from="me" />
                <MessageElement from="other" />
                <MessageElement from="other" />
                <MessageElement from="me" />
            </div>
            <SendMessageForm />
        </section>
    );
}