'use client';
import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface GameResult {
  id: number;
  threshold: number;
  condition: 'more' | 'less';
  result: number;
  win: boolean;
  timestamp: Date;
}

export default function HomePage() {
  const [threshold, setThreshold] = useState<string>('50');
  const [condition, setCondition] = useState<'more' | 'less'>('more');
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<GameResult[]>([]);

  const handleThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= 100)) {
      setThreshold(value);
    }
  };

  const handleConditionChange = (
    event: React.MouseEvent<HTMLElement>,
    newCondition: 'more' | 'less' | null,
  ) => {
    if (newCondition !== null) {
      setCondition(newCondition);
    }
  };

  const handlePlay = () => {
    const thresholdNum = Number(threshold);
    
    if (!threshold || thresholdNum < 1 || thresholdNum > 100) {
      alert('Будь ласка, введіть число від 1 до 100');
      return;
    }

    setIsRolling(true);
    
    // Симуляція обертання кубика
    setTimeout(() => {
      const result = Math.floor(Math.random() * 100) + 1;
      const win = condition === 'more' 
        ? result > thresholdNum 
        : result < thresholdNum;

      setCurrentResult(result);

      const newGame: GameResult = {
        id: Date.now(),
        threshold: thresholdNum,
        condition,
        result,
        win,
        timestamp: new Date()
      };

      // Додаємо в історію (максимум 10 елементів)
      setHistory(prev => {
        const updated = [newGame, ...prev];
        return updated.slice(0, 10);
      });

      setIsRolling(false);
    }, 1000);
  };

  const getResultColor = (win: boolean) => win ? 'success' : 'error';

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 4
          }}
        >
          🎲 Dice Game
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3
        }}>
          {/* Ліва панель - Гра */}
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Налаштування гри
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <TextField 
                label="Введіть поріг (1-100)" 
                variant="outlined" 
                fullWidth
                type="number"
                value={threshold}
                onChange={handleThresholdChange}
                inputProps={{ min: 1, max: 100 }}
                sx={{ mb: 3 }}
              />

              <Typography variant="body1" sx={{ mb: 1 }}>
                Умова:
              </Typography>
              <ToggleButtonGroup
                value={condition}
                exclusive
                onChange={handleConditionChange}
                fullWidth
                sx={{ mb: 3 }}
              >
                <ToggleButton value="more">
                  <ArrowUpwardIcon sx={{ mr: 1 }} />
                  Більше
                </ToggleButton>
                <ToggleButton value="less">
                  <ArrowDownwardIcon sx={{ mr: 1 }} />
                  Менше
                </ToggleButton>
              </ToggleButtonGroup>

              <Button 
                variant="contained" 
                size="large"
                fullWidth
                onClick={handlePlay}
                disabled={isRolling || !threshold}
                startIcon={<CasinoIcon />}
                sx={{ 
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
              >
                {isRolling ? 'Кидаємо...' : 'Грати'}
              </Button>
            </Box>

            {/* Результат */}
            {currentResult !== null && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Результат:
                </Typography>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: getResultColor(history[0]?.win || false) + '.main',
                    my: 2
                  }}
                >
                  {currentResult}
                </Typography>
                {history[0] && (
                  <Chip 
                    icon={history[0].win ? <CheckCircleIcon /> : <CancelIcon />}
                    label={history[0].win ? 'Виграш!' : 'Програш'}
                    color={getResultColor(history[0].win)}
                    sx={{ fontSize: '1rem', py: 3, px: 2 }}
                  />
                )}
              </Box>
            )}
          </Paper>

          {/* Права панель - Історія */}
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Історія ігор
            </Typography>
            
            {history.length === 0 ? (
              <Typography variant="body1" sx={{ mt: 3, color: 'text.secondary' }}>
                Історія ігор порожня. Зіграйте першу гру!
              </Typography>
            ) : (
              <List sx={{ mt: 2 }}>
                {history.map((game, index) => (
                  <Box key={game.id}>
                    <ListItem 
                      sx={{ 
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        bgcolor: index === 0 ? 'action.hover' : 'transparent',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        width: '100%',
                        mb: 1
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          {game.timestamp.toLocaleTimeString('uk-UA')}
                        </Typography>
                        <Chip 
                          icon={game.win ? <CheckCircleIcon /> : <CancelIcon />}
                          label={game.win ? 'Виграш' : 'Програш'}
                          size="small"
                          color={getResultColor(game.win)}
                        />
                      </Box>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            Поріг: <strong>{game.threshold}</strong> | 
                            Умова: <strong>{game.condition === 'more' ? 'Більше' : 'Менше'}</strong> | 
                            Результат: <strong>{game.result}</strong>
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < history.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}