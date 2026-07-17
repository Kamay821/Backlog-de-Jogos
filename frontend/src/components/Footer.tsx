export function Footer() {
  return (
    <footer className="bg-zinc-200/50 dark:bg-black/50 text-zinc-600 dark:text-zinc-400 py-4 text-center mt-10 transition-colors">
      <p className="text-sm">
        © {new Date().getFullYear()} Backlog de Jogos. Projeto Trainee Serra Júnior.
      </p>
    </footer>
  )
}
