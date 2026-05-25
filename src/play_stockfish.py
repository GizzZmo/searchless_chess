# Copyright 2025 DeepMind Technologies Limited
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================

"""Play a local game against Stockfish at a configurable Elo rating."""

from collections.abc import Sequence

from absl import app
from absl import flags
import chess
import chess.engine

from searchless_chess.src.engines import stockfish_engine

_ELO = flags.DEFINE_integer(
    name='elo',
    default=1500,
    help='Target Stockfish Elo (supported range usually 1320-3190).',
)
_TIME_PER_MOVE = flags.DEFINE_float(
    name='time_per_move',
    default=0.1,
    help='Thinking time (seconds) allocated to Stockfish per move.',
)
_HUMAN_COLOR = flags.DEFINE_enum(
    name='human_color',
    default='white',
    enum_values=('white', 'black'),
    help='Which color the human plays.',
)


def _describe_result(board: chess.Board, human_is_white: bool) -> str:
  if board.is_checkmate():
    human_won = board.turn != (chess.WHITE if human_is_white else chess.BLACK)
    return 'You win by checkmate.' if human_won else 'Stockfish wins by checkmate.'
  if board.is_stalemate():
    return 'Draw by stalemate.'
  if board.is_insufficient_material():
    return 'Draw by insufficient material.'
  if board.can_claim_fifty_moves():
    return 'Draw by fifty-move rule (claimable).'
  if board.can_claim_threefold_repetition():
    return 'Draw by threefold repetition (claimable).'
  return f'Game over: {board.result(claim_draw=True)}'


def _prompt_human_move(board: chess.Board) -> chess.Move:
  while True:
    user_move = input('Your move (UCI like e2e4, or SAN like Nf3): ').strip()
    if not user_move:
      continue
    try:
      move = board.parse_uci(user_move)
    except ValueError:
      try:
        move = board.parse_san(user_move)
      except ValueError:
        print('Invalid move format or illegal move. Try again.')
        continue
    if move in board.legal_moves:
      return move
    print('Illegal move. Try again.')


def main(argv: Sequence[str]) -> None:
  if len(argv) > 1:
    raise app.UsageError('Too many command-line arguments.')
  if _ELO.value <= 0:
    raise app.UsageError('--elo must be a positive integer.')
  if _TIME_PER_MOVE.value <= 0:
    raise app.UsageError('--time_per_move must be > 0.')

  board = chess.Board()
  human_is_white = _HUMAN_COLOR.value == 'white'
  stockfish_is_white = not human_is_white
  engine = stockfish_engine.StockfishEngine(
      limit=chess.engine.Limit(time=_TIME_PER_MOVE.value),
      elo_rating=_ELO.value,
  )

  print('=== Play vs Stockfish ===')
  print(f'Stockfish Elo: {_ELO.value}')
  print(f'You are playing as {_HUMAN_COLOR.value}.')
  print("Enter moves in UCI (e2e4) or SAN (Nf3).")

  while not board.is_game_over(claim_draw=True):
    print('\n' + str(board))
    print(f'FEN: {board.fen()}')

    stockfish_to_move = board.turn == (chess.WHITE if stockfish_is_white else chess.BLACK)
    if stockfish_to_move:
      move = engine.play(board)
      print(f'Stockfish plays: {board.san(move)} ({move.uci()})')
      board.push(move)
    else:
      board.push(_prompt_human_move(board))

  print('\n' + str(board))
  print(f'Result: {board.result(claim_draw=True)}')
  print(_describe_result(board, human_is_white=human_is_white))


if __name__ == '__main__':
  app.run(main)
