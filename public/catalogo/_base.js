/* Ajudantes dos arquivos do catálogo.
   T(layout, campos, fotos, extra) monta uma tela. extra: { inv: true } inverte fundo e texto;
   { aj: [{zoom, fx, fy}] } define o enquadramento inicial de cada foto.
   Nas legendas: {marca} = nome da loja; {2.preco1} = campo "preco1" da tela 2 (segue a edição da cliente). */
export const F = n => `assets/exemplo/${n}.jpg`;
export const CAIXA = "assets/elementos/caixa-presente.jpg";
export const T = (l, c, f = [], extra = {}) => ({ l, c, f, ...extra });
export const close = (zoom = 2, fx = 0.5, fy = 0.5) => ({ zoom, fx, fy });
export const FOTOS = {
  presentes: F("01-presentes"), clutch: F("02-clutch"), lenco: F("03-lenco"), brincos: F("04-brincos"),
  servico: F("05-servico-capa"), makeLeve: F("06-make-leve"), glow: F("07-glow"), penteado: F("08-penteado"),
  vestido: F("09-vestido"), camisa: F("10-camisa"), salto: F("11-salto"), colar: F("12-colar"), perfume: F("13-perfume"),
  oculos: F("14-oculos"), sacola: F("15-sacola"), tacas: F("16-tacas"), vestidoBranco: F("17-vestido-branco"),
  relogio: F("18-relogio"), vela: F("19-vela"), spa: F("20-spa"), esmaltes: F("21-esmaltes"), camera: F("22-camera"),
  polaroides: F("23-polaroides"), bolo: F("24-bolo"), flores: F("25-flores"), pente: F("26-pente-tesoura"),
  caderno: F("27-caderno"), luzes: F("28-luzes"), estrelinha: F("29-estrelinha")
};
