import ActiveMember from "./Elements/ActiveMember";

export default function ActiveMembersSection() {
    return (
        <section className='flex overflow-x-auto mx-auto items-center gap-2 py-3 flex-shrink-0'>
            <ActiveMember type="mid" active={true} />
            <ActiveMember type="mid" active={true} />
            <ActiveMember type="mid" active={false} />
            <ActiveMember type="mid" active={false} />
            <ActiveMember type="mid" active={true} />
            <ActiveMember type="mid" active={true} />
        </section>
    );
}