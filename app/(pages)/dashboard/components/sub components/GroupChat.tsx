import MessageElement from "./Elements/MessageElement";
import SendMessageForm from "./Elements/SendMessageForm";

export default function GroupChat() {
    return (
        <section className="flex-1 overflow-y-auto flex flex-col gap-2 mt-3 rounded-lg bg-black p-2">
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