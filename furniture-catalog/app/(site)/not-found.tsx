import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page py-24 flex flex-col items-center text-center gap-4">
      <span className="spec-tag px-3 py-1">404</span>
      <h1 className="font-display text-3xl md:text-4xl text-ink">Страница не найдена</h1>
      <p className="text-ink-soft max-w-sm">
        Возможно, товар был снят с публикации или адрес введён неверно.
      </p>
      <ButtonLink href="/catalog" className="mt-2">
        Вернуться в каталог
      </ButtonLink>
      <Link href="/" className="text-sm text-ink-soft hover:text-brass-deep">
        На главную
      </Link>
    </div>
  );
}
