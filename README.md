#Dashboard de Usuários Offline
##Este é um projeto feito para testar meus conhecimentos nas tecnologias e ferramentas utilizadas, o objetivo é criar um dashboard de usuários offline na rede usando dados filtrados do banco de dados IXC SOFT. Ele agrupa os clientes por cidades ou regiões pré-determinadas contando com uma interface moderna, intuitiva e dinamica.
Para provedores de internet que utilizam os sistemas IXC SOFT, pode ser útil para oferecer o suporte aos usuários com mais eficiencia ainda, o controle sobre problemas envolvendo desconexões na rede pode ser acompanhado em tempo real nesse painel junto aos detalhes da região selecionada, listando os usuários afetados e seus respectivos dados(horário da queda, endereço, telefone, concentrador, endereço MAC do dispositivo, registros de ordem de serviço em andamento).

Pré-requisitos
Antes de começar a usar este projeto, certifique-se de que você tenha o seguinte:

Servidor web (por exemplo, Apache, Nginx) configurado para executar PHP.
Acesso ao banco de dados ixcprovedor do ixc soft.
Conhecimento de HTML, CSS, SQL, PHP e JavaScript.
Instalação
Clone este repositório para o seu ambiente de desenvolvimento:
bash
Copy code
git clone https://github.com/VitorGRCruz/Dashboard-IXC-usuarios-offline.git
Configure as informações de conexão com o banco de dados no arquivo config/off.php.

Uso
Abra o arquivo index.html no seu navegador para acessar o dashboard.


Estrutura do Projeto
O projeto é organizado da seguinte maneira:

dash.html: A página principal do dashboard.
estilos/: Pasta contendo arquivos de estilo CSS.
assets/: Pasta para fontes e imagens utilizadas no projeto.
config/: Pasta com códigos PHP, JavaScript e SQL relacionados à configuração, funcionalidade e consulta de dados do dashboard.
Uso
Abra o arquivo dash.html em seu navegador para visualizar o dashboard.
O dashboard deve exibir os clientes agrupados por cidades ou regiões pré-determinadas com base nos dados do banco de dados do ixc soft.
Contribuição
Se você deseja contribuir para este projeto, siga estas etapas:

Faça um fork do repositório.
Crie uma branch para sua nova funcionalidade: git checkout -b minha-nova-funcionalidade.
Faça suas alterações e commit: git commit -m 'Adicionei uma nova funcionalidade'.
Faça o push da branch: git push origin minha-nova-funcionalidade.
Abra um pull request para revisão.
Licença
Este projeto está sob a licença [GNU GPL]. Consulte o arquivo LICENSE para obter mais informações.

Contato
Para obter mais informações sobre este projeto, entre em contato com [vitorgomes0703@outlook.com].
