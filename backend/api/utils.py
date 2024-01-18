from sqlite3 import IntegrityError

# convert query tuple or tuples to json based on cursor description
# used for select operations not data modifications
def query_to_dict(cursor, query, args=(), many=True):
    res = cursor.execute(query, args)

    res_dict = [dict((res.description[i][0], value) \
               for i, value in enumerate(row)) for row in res.fetchall()]
    
    return (res_dict[0] if res_dict else None) if not many else res_dict

# execute and commit a query with error checking and proper response formatting
def execute_commit_error_check(db, cursor, query, args=()) -> tuple[dict[None], int] | tuple[dict[str, str], int]:
    try:
        cursor.execute(query, args)
        db.commit()

    except IntegrityError as e:
        return {'error': str(e)}, 400
    
    return {}, 200