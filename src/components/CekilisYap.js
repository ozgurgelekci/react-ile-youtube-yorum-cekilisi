import React, { useState, useRef } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const CekilisYap = () => {
  const fileInputRef = useRef(null);
  const [jsonContents, setJsonContents] = useState([]);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [winnerData, setWinnerData] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${day}.${month}.${year} - ${hours}:${minutes}`;
  };

  const handleReadFiles = async (event) => {
    const files = event.target.files;
    const filePromises = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = reject;
        fileReader.readAsText(file);
      });
    });

    try {
      const fileContents = await Promise.all(filePromises);
      setJsonContents(fileContents);

      let totalUsers = 0;
      fileContents.forEach((content) => {
        const users = JSON.parse(content);

        const uniqueUsers = filterUniqueUsers(users);
        totalUsers += uniqueUsers.length;
      });
      setTotalUserCount(totalUsers);
    } catch (error) {
      console.error("Error reading the selected JSON files:", error);
    }
  };

  const filterUniqueUsers = (users) => {
    const userMap = {};

    return users.reduce((uniqueUsers, user) => {
      if (!userMap[user.userUrl]) {
        userMap[user.userUrl] = true;
        uniqueUsers.push(user);
      }
      return uniqueUsers;
    }, []);
  };

  const handleStartDraw = () => {
    try {
      if (jsonContents.length === 0) {
        console.error("JSON içeriği boş!");
        return;
      }

      const allUsers = jsonContents.reduce((all, content) => {
        const users = JSON.parse(content);
        const uniqueUsers = filterUniqueUsers(users);
        return all.concat(uniqueUsers);
      }, []);

      if (allUsers.length === 0) {
        console.error("JSON dosyalarında kullanıcı bilgisi bulunmamaktadır!");
        return;
      }

      const randomIndex = Math.floor(Math.random() * allUsers.length);

      const winnerData = allUsers[randomIndex];

      setModalOpen(true);

      const showParticipantsUsername = () => {
        let currentIndex = 0;
        const interval = setInterval(() => {
          setWinner(allUsers[currentIndex].username);
          currentIndex++;
          if (currentIndex === allUsers.length) {
            clearInterval(interval);
            setTimeout(() => {
              setWinnerData(winnerData);
              setWinner(winnerData.username);
            }, 15);
          }
        }, 10);
      };

      showParticipantsUsername();
    } catch (error) {
      console.error("Çekiliş yapılırken bir hata oluştu:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Çekiliş Yapma Sayfası
      </Typography>
      <input
        type="file"
        accept=".json"
        multiple
        onChange={handleReadFiles}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <label htmlFor="file-input">
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={() => fileInputRef.current.click()}
        >
          Yorumları Oku
        </Button>
      </label>

      <Typography variant="h6" component="h2" gutterBottom>
        Toplam Katılımcı Sayısı: {totalUserCount}
      </Typography>

      <Button variant="contained" color="primary" onClick={handleStartDraw}>
        Çekilişi Başlat
      </Button>
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="dialog-title"
        PaperProps={{
          style: { minWidth: "600px", width: "600px" }, // Hem içerik genişliği hem de modal genişliği
        }}
      >
        <DialogTitle id="dialog-title">Kazanan Bilgileri</DialogTitle>
        <DialogContent>
          <Typography variant="h6" component="p">
            TEBRİKLER {winner}
          </Typography>

          {winner === winnerData?.username && (
            <div>
              <Typography variant="body1" component="p">
                Video: {winnerData.videoTitle}
              </Typography>
              <Typography variant="body1" component="p">
                Kullanıcı Adı: {winnerData.username}
              </Typography>
              <Typography variant="body1" component="p">
                Kullanıcı URL: {winnerData.userUrl}
              </Typography>
              <Typography variant="body1" component="p">
                Yayınlanma Tarihi: {formatDate(winnerData.publishedAt)}
              </Typography>
              <Typography variant="body1" component="p">
                Yorum: {winnerData.text}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CekilisYap;
