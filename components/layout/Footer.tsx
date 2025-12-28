export default function Footer() {
    return (
        <footer className="bg-[#151619] border-t border-gray-700/50 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Hakkımızda</h3>
                        <p className="text-gray-400">
                            Metin2 ve Royale Online için güvenilir item ve yang satış platformu.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Hızlı Linkler</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="/kategori/metin2" className="hover:text-white">Metin2</a>
                            </li>
                            <li>
                                <a href="/kategori/royale-online" className="hover:text-white">Royale Online</a>
                            </li>
                            <li>
                                <a href="/auth/sign-in" className="hover:text-white">Giriş Yap</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">İletişim</h3>
                        <p className="text-gray-400">
                            Destek için bizimle iletişime geçin.
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700/50 text-center text-gray-400">
                    <p>&copy; 2025 Royale Satış. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    )
}
