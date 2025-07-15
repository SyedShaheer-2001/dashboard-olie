
import PageContainer from "@/app/components/container/PageContainer";
import Interests from "@/app/components/shared/Interests";


export default function SamplePage() {

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <Interests/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
