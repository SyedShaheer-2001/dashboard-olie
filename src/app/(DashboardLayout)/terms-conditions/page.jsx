
import PageContainer from "@/app/components/container/PageContainer";
import TermsConditions from "@/app/components/shared/TermsConditions";


export default function SamplePage() {

 
  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <TermsConditions/>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
