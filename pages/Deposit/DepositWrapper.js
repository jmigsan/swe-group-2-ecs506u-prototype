import dynamic from "next/dynamic";
const DepositComponent = dynamic(() => import("./Deposit"), {
  ssr: false,
});

export default function Deposit(){
    return <DepositComponent/>;
}