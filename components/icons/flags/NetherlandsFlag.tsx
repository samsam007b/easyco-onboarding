export default function NetherlandsFlag({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#21468B"/>
      <rect width="900" height="400" fill="#FFF"/>
      <rect width="900" height="200" fill="#AE1C28"/>
    </svg>
  );
}
