import Link from "next/link";


const ContactMe = () => {
  return (
    <div className="mx-auto flex flex-row items-center">
      <Link
        href="mailto:weijunext@gmail.com"
        target="_blank"
        rel="noopener norefferer nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
       
      </Link>
      <Link
        href="https://github.com/weijunext"
        target="_blank"
        rel="noopener norefferer nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
      </Link>
      <Link
        href="https://x.com/weijunext"
        target="_blank"
        rel="noopener norefferer nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
      
      </Link>
      <Link
        href="https://juejin.cn/user/26044008768029"
        target="_blank"
        rel="noopener norefferer nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
     
      </Link>
      <Link
        href="https://weijunext.com/make-a-friend"
        target="_blank"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
       
      </Link>
      <Link
        href="https://www.buymeacoffee.com/weijunext"
        target="_blank"
        rel="noopener norefferer nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
      
      </Link>
    </div>
  );
};
export default ContactMe;
