
import PageContainer from "@/app/components/container/PageContainer";
import Feedback from "@/app/components/shared/Feedback";


export default function SamplePage() {

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <Feedback/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
