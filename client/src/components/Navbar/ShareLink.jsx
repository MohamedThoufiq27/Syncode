import { toast } from "react-toastify";
import { FaShare } from "react-icons/fa6";
import { useSharedData } from "../../hooks/useSharedData";

 

 const ShareLink = () => {
    const {roomid} = useSharedData();

    const handleShareLink = () => {
        
        const url = `${window.location.origin}/editor/${roomid}`;

        if (navigator.share) {
            navigator.share({
            title: 'Join my room on CodeSync',
            text: 'Collaborate with me in real time!',
            url: url,
            })
            .then(() => console.log('Shared successfully'))
            .catch((err) => console.error('Sharing failed', err));
        } else {
            navigator.clipboard.writeText(url)
            .then(() => {
                toast.success("Link copied to clipboard (sharing not supported)");
            })
            .catch(() => {
                toast.error("Failed to copy the link");
            });
        }
    };
    return (
        <div onClick={handleShareLink} className='pl-2 pr-1'>
            <FaShare className="size-4 text-white"/>
        </div>
    )
}

export default ShareLink;

