export default function SpainFlag({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 750 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="750" height="500" fill="#AA151B"/>
      <rect width="750" height="250" y="125" fill="#F1BF00"/>
    </svg>
  );
}
