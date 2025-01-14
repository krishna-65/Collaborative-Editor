import Avatar from "react-avatar";

const Client = ({userName}) => {
    return(
            <div className="flex flex-col items-center gap-2">
                <Avatar className="avatar" name={userName} size={50} round='14px'/>
                <span className="text-centers">{userName}</span>
            </div>
    )
}
export default Client;
{/* <div className="clientWrapper">
<Avatar className="avatar" name={userName} size={50} round='14px'/>
<span className="userName">{userName}</span>
</div> */}