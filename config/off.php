<?php
header('Content-Type: application/json');
$servername = "xxxxxxxx";
$username = "xxxxxxxx";
$password = "xxxxxxxx";
$dbname = "ixcprovedor";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
if ($_GET['flag'] == 1) {

    if ($_GET['filtro'] == 'todos') {
        $filtro = " ";
    } else {
        $filtro = "AND (radusuarios.obs like '%desliga%')";
    }


    if ($_GET['mapa'] == 'cidades') {
        $sql = "SELECT 
        cidades.nome AS cidade,
        COALESCE(contagens.contagem, 0) AS contagem
    FROM
        (SELECT 'Agudos' AS nome
        UNION ALL SELECT 'Ibatinga'
        UNION ALL SELECT 'Catanduva' 
        UNION ALL SELECT 'Dracena'
        UNION ALL SELECT 'Ourinhos'
        UNION ALL SELECT 'Fernandópolis'
        UNION ALL SELECT 'Olímpia'
        UNION ALL SELECT 'Araçatuba'
        UNION ALL SELECT 'Penápolis'
        UNION ALL SELECT 'Jales'
        UNION ALL SELECT 'Auriflama') AS cidades
    LEFT JOIN
        (SELECT 
             cidade.nome AS cidade,
             COUNT(radusuarios.login) AS contagem
        FROM radusuarios
  Inner Join
  cliente_contrato On radusuarios.id_contrato = cliente_contrato.id
  Inner Join
  cliente On cliente_contrato.id_cliente = cliente.id
  Inner Join
  cidade On cidade.id = cliente.cidade
        WHERE 
            (cidade.nome IN ('Agudos', 'Ibatinga', 'Catanduva','Dracena', 'Ourinhos', 'Fernandópolis', 'Olímpia', 'Araçatuba','Penápolis','Jales','Auriflama'))
            AND (radusuarios.ativo = 'S')
            AND (radusuarios.online = 'N')
            AND (cliente_contrato.status_internet = 'A') $filtro
            GROUP BY cidade.nome) AS contagens ON cidades.nome COLLATE utf8mb4_general_ci = contagens.cidade
    ";
        $result = $conn->query($sql);

        if ($result === false) {
            die("Erro na consulta: " . $conn->error);
        }
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[$row['cidade']] = $row['contagem'];
        }
    } else if ($_GET['mapa'] == 'presp' || $_GET['mapa'] == 'franca') {
        if($_GET['mapa'] == 'presp'){
            $cidade = 'Presidente Prudente';
        }
        else if( $_GET['mapa'] == 'franca'){
            $cidade = 'Franca';
        }

        $sql = "SELECT radusuarios.conexao AS concentrador,
        CASE
          WHEN COUNT(CASE WHEN radusuarios.online = 'N' THEN 1 END) = 0 THEN 0
          ELSE COUNT(CASE WHEN radusuarios.online = 'N' THEN 1 END)
        END AS contagem
      FROM
        cidade
        INNER JOIN cliente ON cidade.id = cliente.cidade
        INNER JOIN radusuarios ON radusuarios.id_cliente = cliente.id
        INNER JOIN cliente_contrato ON radusuarios.id_contrato = cliente_contrato.id
      WHERE
        (cidade.nome = '$cidade') AND
        (radusuarios.ativo = 'S') AND
        (cliente_contrato.status = 'A') AND
        (cliente_contrato.status_internet = 'A') $filtro
      GROUP BY
         radusuarios.conexao
      ORDER BY
        radusuarios.conexao;";

        $result = $conn->query($sql);

        if ($result === false) {
            die("Erro na consulta: " . $conn->error);
        }
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[$row['concentrador']] = $row['contagem'];
        }
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    
} else if ($_GET['flag'] == 2) {
    $regiao =  $_GET['regiao'];
    $mapa =  $_GET['mapa'];
            if ($mapa == "cidades") {
                $where = "(cidade.nome = '$regiao')";
            } else if($_GET['mapa'] == 'presp' || $_GET['mapa'] == 'franca')  {
                $where = "(radusuarios.conexao like '%$regiao%')";
            }
           
    
    $filtro = $_GET['filtro'];
    if ($filtro == 'todos') {
        $filtro = ' ';
    } else {
        $filtro = " AND (radusuarios.obs IS NULL OR radusuarios.obs like '%desliga%')";
    }

    $sql = "Select
    radusuarios.login,
    Coalesce(radusuarios.onu_mac, '') As Mac,
    Coalesce(rad_caixa_ftth.descricao, '') As Cto,
    radusuarios.conexao As Concentrador,
    Date_Format(radusuarios.ultima_conexao_final, '%d/%m/%Y %H:%i:%s') As down,
    Date_Format(radusuarios.ultima_conexao_inicial, '%d/%m/%Y %H:%i:%s') As up,
    Concat(cliente.endereco, ', ', cliente.numero) As Endereço,
    cliente.razao As nome,
    Concat_Ws('</br>', Case When cliente.fone Is Not Null Then cliente.fone End, 
    Case When cliente.telefone_comercial Is Not Null And cliente.telefone_comercial <> cliente.fone Then cliente.telefone_comercial End, 
    Case When cliente.telefone_celular Is Not Null And cliente.telefone_celular <> cliente.fone And cliente.telefone_celular <> cliente.telefone_comercial Then cliente.telefone_celular End, 
    Case When cliente.whatsapp Is Not Null And cliente.whatsapp <> cliente.fone And cliente.whatsapp <> cliente.telefone_comercial And cliente.whatsapp <> cliente.telefone_celular Then cliente.whatsapp End) 
    As telefone,
   
  (Select Concat(Date_Format(su_oss_chamado.data_abertura, '%d/%m/%Y'), ' - ', su_oss_assunto.assunto) 
  From su_oss_chamado 
    Inner Join su_oss_assunto On su_oss_chamado.id_assunto = su_oss_assunto.id 
  Where (cliente.id = su_oss_chamado.id_cliente) And 
    (su_oss_chamado.status != 'F') And 
    (su_oss_chamado.id_assunto In ('3', '14', '64', '75', '78', '76', '77', '62')) 
  Order By su_oss_chamado.data_abertura Desc Limit 1) As OS
  From
  radusuarios
  Left Join
  rad_caixa_ftth On radusuarios.id_caixa_ftth = rad_caixa_ftth.id
  Inner Join
  cliente_contrato On radusuarios.id_contrato = cliente_contrato.id
  Inner Join
  cliente On cliente_contrato.id_cliente = cliente.id
  Inner Join
  cidade On cidade.id = cliente.cidade
  Where
  $where And
    (radusuarios.ativo = 'S') And
    (radusuarios.online = 'N') And
    (cliente_contrato.status ='A') And
    (cliente_contrato.status_internet = 'A') $filtro
  Order By
    radusuarios.ultima_conexao_final Desc";

    $result = $conn->query($sql);
    if ($result === false) {
        die("Erro na consulta: " . $conn->error);
        
    }
    $data = array();
    while ($row = $result->fetch_assoc()) {

        $data[] = $row;
    }
    echo json_encode($data);
}

$conn->close();
