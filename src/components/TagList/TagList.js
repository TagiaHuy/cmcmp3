import React, { useMemo } from 'react';
import { Box, Card, CardActionArea, Typography, Stack } from '@mui/material';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const TagList = ({ tags = [] }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // tạo palette background khác nhau cho mỗi tag (ổn định theo id/name)
  const palettes = useMemo(
    () => [
      ['#7C3AED', '#06B6D4'],
      ['#F97316', '#EF4444'],
      ['#22C55E', '#14B8A6'],
      ['#3B82F6', '#A855F7'],
      ['#F59E0B', '#10B981'],
      ['#EC4899', '#6366F1'],
    ],
    []
  );

  const pickPalette = (t) => {
    const key = String(t?.id ?? t?.name ?? '0');
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
    const idx = Math.abs(hash) % palettes.length;
    return palettes[idx];
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
          md: 'repeat(4, minmax(0, 1fr))',
          lg: 'repeat(6, minmax(0, 1fr))',
        },
        gap: 2,
      }}
    >
      {tags.map((tag) => {
        const [c1, c2] = pickPalette(tag);

        return (
          <Card
            key={tag.id ?? tag.name}
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: alpha('#0b1020', 0.35),
              border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
              position: 'relative',
              transition: 'transform .18s ease, border-color .18s ease, box-shadow .18s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: alpha(theme.palette.common.white, 0.16),
                boxShadow: `0 10px 30px ${alpha('#000', 0.25)}`,
              },
            }}
          >
            <CardActionArea
              onClick={() => navigate(`/tags/${tag.id}`)}
              sx={{ height: '100%' }}
            >
              {/* nền gradient */}
              <Box
                sx={{
                  p: 2,
                  height: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: `linear-gradient(135deg, ${alpha(c1, 0.55)}, ${alpha(c2, 0.45)})`,
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: alpha(theme.palette.common.black, 0.25),
                      border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
                    }}
                  >
                    <LocalOfferRoundedIcon fontSize="small" />
                  </Box>

                  {/* pill nhỏ góc phải */}
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 999,
                      fontSize: 12,
                      color: 'text.primary',
                      bgcolor: alpha(theme.palette.common.black, 0.25),
                      border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
                    }}
                  >
                    TAG
                  </Box>
                </Stack>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: 16,
                      color: 'text.primary',
                      lineHeight: 1.2,
                      textShadow: `0 2px 8px ${alpha('#000', 0.35)}`,
                    }}
                    noWrap
                    title={tag.name}
                  >
                    {tag.name}
                  </Typography>

                  {!!tag.description && (
                    <Typography
                      sx={{
                        mt: 0.6,
                        fontSize: 12.5,
                        color: alpha(theme.palette.common.white, 0.78),
                        lineHeight: 1.25,
                      }}
                      noWrap
                      title={tag.description}
                    >
                      {tag.description}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* footer nhỏ */}
              <Box
                sx={{
                  px: 2,
                  py: 1.2,
                  bgcolor: alpha(theme.palette.common.black, 0.2),
                  borderTop: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
                }}
              >
                <Typography sx={{ fontSize: 12, color: alpha(theme.palette.common.white, 0.7) }}>
                  Xem danh sách bài hát
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
};

export default TagList;
